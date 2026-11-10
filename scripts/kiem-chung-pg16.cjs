const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const { existsSync, readdirSync, readFileSync } = require('node:fs');
const { createRequire } = require('node:module');
const { createServer } = require('node:net');
const os = require('node:os');
const { resolve } = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');

const accounts = ['sales01', 'sales02', 'sales03', 'manager01', 'manager02'];
const stages = ['TIEP_CAN', 'TU_VAN', 'BAO_GIA', 'CHOT'];
const root = process.cwd();

async function availablePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(error => error ? reject(error) : resolvePort(port));
    });
  });
}

function runSeed(file, env) {
  const run = spawnSync(process.execPath, [file], {
    cwd: root,
    env,
    encoding: 'utf8',
    timeout: 60000
  });
  if (run.error) throw run.error;
  assert.equal(run.status, 0, `Seed that bai: ${file} (exit ${run.status}).`);
}

async function provision(pool, env) {
  const files = readdirSync(resolve(root, 'migrations')).filter(file => file.endsWith('.sql')).sort();
  assert.ok(files.length, 'Khong tim thay migration.');
  for (const file of files) {
    await pool.query(readFileSync(resolve(root, 'migrations', file), 'utf8'));
  }
  await pool.query(readFileSync(resolve(root, 'seeds/001_seed_demo.sql'), 'utf8'));
  runSeed('seeds/002_setup_demo_login.js', env);
  runSeed('seeds/004_seed_references.js', env);

  const initial = await opportunityCount(pool);
  assert.ok(initial <= 100, `Seed da tao ${initial} co hoi. Can dung dung 100 de do NFR1.`);
  if (initial < 100) {
    await pool.query(`
      WITH staff AS (
        SELECT user_id, row_number() OVER (ORDER BY username) AS position
        FROM app_user
        WHERE username = ANY($2::text[]) AND role = 'SALES' AND is_active
      )
      INSERT INTO opportunity (customer_id, product_id, owner_id, need_desc, expected_value, stage)
      SELECT
        (SELECT customer_id FROM customer ORDER BY customer_id LIMIT 1),
        (SELECT product_id FROM product WHERE is_active ORDER BY product_id LIMIT 1),
        staff.user_id,
        'NFR1 fixture ' || series.n,
        1000000 + series.n * 10000,
        ($3::text[])[(series.n - 1) % 4 + 1]
      FROM generate_series(1, $1::integer) AS series(n)
      JOIN staff ON staff.position = (series.n - 1) % 3 + 1
    `, [100 - initial, accounts.slice(0, 3), stages]);
  }
  assert.equal(await opportunityCount(pool), 100, 'Dataset NFR1 phai co dung 100 co hoi.');
  await pool.query('ANALYZE opportunity');
}

async function opportunityCount(pool) {
  const { rows } = await pool.query('SELECT count(*)::int AS total FROM opportunity');
  return rows[0].total;
}

function createApi(base) {
  return async (path, { method = 'GET', token, body, expected } = {}) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body) headers['Content-Type'] = 'application/json';

    const started = performance.now();
    const response = await fetch(base + path, {
      method,
      headers,
      body: body && JSON.stringify(body),
      signal: AbortSignal.timeout(15000)
    });
    const raw = await response.text();
    const elapsed = performance.now() - started;
    let data;
    try { data = JSON.parse(raw); } catch { data = null; }
    if (expected !== undefined) {
      const code = typeof data?.message === 'string' && /^[A-Z0-9_]+$/.test(data.message)
        ? ` ${data.message}`
        : '';
      assert.equal(response.status, expected, `${method} ${path}: HTTP ${response.status}${code}, mong doi ${expected}.`);
    }
    return { status: response.status, data, elapsed };
  };
}

async function waitForServer(api, child) {
  for (let attempt = 0; attempt < 50; attempt++) {
    assert.ok(child.exitCode === null && child.signalCode === null, 'Backend thu dung truoc khi san sang.');
    try {
      const { status, data } = await api('/health');
      if (status === 200 && data?.database === 'connected') return;
    } catch {
      // Backend có thể chưa mở cổng.
    }
    await delay(200);
  }
  throw new Error('Backend thu khong san sang tai /health.');
}

async function measureP95(api, users) {
  const paths = {
    list: '/api/opportunities',
    detail: '/api/opportunities/:id',
    funnel: '/api/opportunities/funnel'
  };
  const samples = { list: [], detail: [], funnel: [] };
  const call = (user, kind) => api(kind === 'detail' ? user.detailPath : paths[kind], {
    token: user.token,
    expected: 200
  });

  for (let i = 0; i < 3; i++) {
    await Promise.all(users.map(user => call(user, 'list')));
    await Promise.all(users.map(user => call(user, 'detail')));
    await Promise.all(users.filter(user => user.role === 'MANAGER').map(user => call(user, 'funnel')));
  }

  const plans = users.map(user => Array.from({ length: 10 }, (_, round) => user.role === 'MANAGER'
    ? ['funnel', 'funnel', round % 2 === 0 ? 'list' : 'detail', 'funnel', 'funnel', 'funnel']
    : ['list', 'detail', 'list', 'detail', 'list', 'detail']).flat());

  // 60 lượt, mỗi lượt chạy 5 yêu cầu của 5 tài khoản. Mỗi API có đúng 100 mẫu.
  for (let turn = 0; turn < 60; turn++) {
    await Promise.all(users.map(async (user, index) => {
      const kind = plans[index][turn];
      const result = await call(user, kind);
      samples[kind].push(result.elapsed);
    }));
  }

  return Object.entries(samples).map(([kind, durations]) => {
    assert.equal(durations.length, 100, `API ${kind} phai co dung 100 mau.`);
    durations.sort((a, b) => a - b);
    const p95 = durations[Math.ceil(durations.length * 0.95) - 1];
    return { api: paths[kind], mau: durations.length, p95_ms: p95.toFixed(2), ket_qua: p95 <= 2000 ? 'PASS' : 'FAIL' };
  });
}

async function waitForBlocked(pool, matches) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    const { rows } = await pool.query(`
      SELECT pid, query, pg_blocking_pids(pid) AS blocked_by
      FROM pg_stat_activity
      WHERE datname = current_database() AND wait_event_type = 'Lock'
    `);
    const observed = rows.find(row => row.blocked_by.length > 0 && matches.test(row.query));
    if (observed) return observed;
    await delay(30);
  }
  throw new Error(`Khong quan sat duoc yeu cau cho khoa PostgreSQL: ${matches}.`);
}

async function checkConcurrentWrite(api, pool, sales) {
  const { data: refs } = await api('/api/opportunities/references', {
    token: sales.token, expected: 200
  });
  const need = 'QA PostgreSQL 16 - before concurrent edit';
  const { data: created } = await api('/api/opportunities', {
    method: 'POST', token: sales.token, expected: 201,
    body: {
      customer_id: refs.customers[0].customer_id,
      product_id: refs.products[0].product_id,
      need_desc: need,
      expected_value: 1000000
    }
  });
  const id = created.opportunity_id;
  const path = `/api/opportunities/${id}`;
  for (const stage of stages.slice(1)) {
    await api(path + '/stage', { method: 'PATCH', token: sales.token, expected: 200, body: { stage } });
  }

  const locker = await pool.connect();
  const requests = [];
  let transactionOpen = false;
  try {
    await locker.query('BEGIN');
    transactionOpen = true;
    const { rows: [locked] } = await locker.query(
      'SELECT need_desc, expected_value, stage, result FROM opportunity WHERE opportunity_id = $1 FOR UPDATE', [id]
    );
    assert.equal(locked.stage, 'CHOT');
    assert.equal(locked.result, null);

    const submitResult = api(path + '/result', {
      method: 'PATCH', token: sales.token, body: { result: 'THANH_CONG' }
    });
    requests.push(submitResult);
    void submitResult.catch(() => {});
    const resultWait = await waitForBlocked(pool, /^\s*UPDATE\s+opportunity\s+SET\s+result\s*=/i);

    const submitEdit = api(path, {
      method: 'PATCH', token: sales.token,
      body: { need_desc: 'QA edit must not be saved', expected_value: 9999999 }
    });
    requests.push(submitEdit);
    void submitEdit.catch(() => {});
    const editWait = await waitForBlocked(pool, /^\s*SELECT\s+o\.result\b[\s\S]+FOR\s+UPDATE/i);

    const { rows: [overlap] } = await pool.query(`
      SELECT count(*)::int AS total FROM pg_stat_activity
      WHERE pid = ANY($1::int[]) AND wait_event_type = 'Lock'
        AND cardinality(pg_blocking_pids(pid)) > 0
    `, [[resultWait.pid, editWait.pid]]);
    assert.equal(overlap.total, 2, 'Phai quan sat ca hai yeu cau dang cho khoa cung luc.');
    await locker.query('COMMIT');
    transactionOpen = false;

    const [result, edit] = await Promise.all(requests);
    const { rows: [final] } = await pool.query(
      'SELECT need_desc, expected_value, stage, result FROM opportunity WHERE opportunity_id = $1', [id]
    );
    console.log(`FR4: opportunity_id=${id}, so yeu cau cho khoa dong thoi=${overlap.total}`);
    console.log(`Ghi ket qua HTTP=${result.status}, sua co hoi HTTP=${edit.status}, ma loi=${edit.data?.message ?? 'none'}`);
    console.log(`PostgreSQL: stage=${final.stage}, result=${final.result}, nhu cau goc=${final.need_desc === need}, gia tri goc=${String(final.expected_value) === String(locked.expected_value)}`);
    assert.equal(result.status, 200);
    assert.equal(edit.status, 409);
    assert.equal(edit.data?.message, 'OPPORTUNITY_FINALIZED');
    assert.equal(final.stage, 'CHOT');
    assert.equal(final.result, 'THANH_CONG');
    assert.equal(final.need_desc, need);
    assert.equal(String(final.expected_value), String(locked.expected_value));
    console.log('FR4 CONCURRENCY: PASS');
  } finally {
    try {
      if (transactionOpen) await locker.query('ROLLBACK');
    } finally {
      locker.release();
      await Promise.allSettled(requests);
    }
  }
}

async function main() {
  assert.ok(existsSync(resolve(root, '.env')) && existsSync(resolve(root, 'src/index.js')),
    'Chay tu thu muc goc cdtn1-ngophutai-l3 co .env.');
  const projectRequire = createRequire(resolve(root, 'package.json'));
  projectRequire('dotenv').config({ path: resolve(root, '.env'), quiet: true });
  const { Pool } = projectRequire('pg');
  const host = process.env.DB_HOST || 'localhost';
  assert.ok(['localhost', '127.0.0.1', '::1'].includes(host), 'Phep thu chi chay voi PostgreSQL cuc bo.');
  const demoPassword = process.env.DEMO_PASSWORD;
  assert.ok(demoPassword && demoPassword.length >= 8, 'Kiem tra DEMO_PASSWORD trong .env.');
  assert.ok(Buffer.byteLength(process.env.JWT_SECRET || '', 'utf8') >= 32, 'Kiem tra JWT_SECRET trong .env.');

  const db = {
    host,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    connectionTimeoutMillis: 5000
  };
  const admin = new Pool({ ...db, database: 'postgres' });
  const database = `mekong_mobile_l3_qa_${Date.now()}`;
  let pool;
  let backend;

  try {
    const { rows: [server] } = await admin.query(
      "SELECT current_setting('server_version') AS version, current_setting('server_version_num')::int AS version_num"
    );
    assert.equal(Math.floor(server.version_num / 10000), 16, `Dang ket noi PostgreSQL ${server.version}, yeu cau 16.`);
    console.log(`PostgreSQL ${server.version} | Node ${process.version} | ${os.platform()} ${os.release()}`);
    console.log(`CPU: ${os.cpus()[0]?.model ?? 'unknown'} | RAM: ${(os.totalmem() / 2 ** 30).toFixed(1)} GiB`);

    await admin.query(`CREATE DATABASE "${database}"`);
    console.log(`Database thu: ${database}`);
    const port = await availablePort();
    const env = { ...process.env, DB_HOST: host, DB_PORT: String(db.port), DB_USER: db.user, DB_NAME: database, PORT: String(port) };
    pool = new Pool({ ...db, database });
    await provision(pool, env);

    backend = spawn(process.execPath, ['src/index.js'], { cwd: root, env, stdio: 'ignore' });
    backend.on('error', error => console.error(`Khong khoi dong duoc backend: ${error.code || error.message}`));
    const api = createApi(`http://127.0.0.1:${port}`);
    await waitForServer(api, backend);

    const users = [];
    for (const username of accounts) {
      const { data } = await api('/api/auth/login', {
        method: 'POST', body: { username, password: demoPassword }, expected: 200
      });
      const token = data.access_token;
      assert.ok(token, `Tai khoan ${username} khong co token.`);
      const { data: list } = await api('/api/opportunities', { token, expected: 200 });
      assert.ok(Array.isArray(list) && list.length, `Tai khoan ${username} can co co hoi de do API chi tiet.`);
      users.push({ token, role: data.user.role, detailPath: `/api/opportunities/${list[0].opportunity_id}` });
    }
    assert.deepEqual(users.map(user => user.role), ['SALES', 'SALES', 'SALES', 'MANAGER', 'MANAGER']);
    console.log('NFR1: 100 co hoi, 5 tai khoan dong thoi, 100 mau moi API, nguong p95 <= 2000 ms.');
    const metrics = await measureP95(api, users);
    console.table(metrics);
    await checkConcurrentWrite(api, pool, users[0]);
    if (metrics.some(row => row.ket_qua === 'FAIL')) process.exitCode = 1;
  } finally {
    if (backend) backend.kill();
    if (pool) await pool.end();
    await admin.end();
  }
}

if (require.main === module) {
  main().catch(error => {
    // Không xuất thông tin đăng nhập hoặc token.
    console.error('KIEM CHUNG DUNG: ' + error.message);
    if (error.code === '42501') console.error('DB_USER can quyen tao database thu (CREATEDB).');
    process.exitCode = 1;
  });
}

module.exports = { measureP95, checkConcurrentWrite };
