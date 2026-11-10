const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const pool = require('../src/db');
const repo = require('../src/repositories/opportunity.repository');
const service = require('../src/services/opportunity.service');
const auth = require('../src/services/auth.service');
const router = require('../src/routes/opportunity.routes');

const sales = { user_id: 1, store_id: 1, role: 'SALES' };
const manager = { user_id: 2, store_id: 1, role: 'MANAGER' };
// Du lieu gia lap, khong doc tai khoan/khach hang tu database that.
const opportunity = {
  opportunity_id: 10, customer_id: 20, product_id: 30,
  customer_name: 'Khach hang mo phong', product_name: 'San pham mo phong',
  customer_phone: '0900000123', owner_id: 1, stage: 'TIEP_CAN',
  result: null, expected_value: '1000000'
};

for (const actor of [sales, manager]) {
  for (const detail of [false, true]) {
    test(`FR2/FR3 repository ${detail ? 'chi tiet' : 'danh sach'} ${actor.role}: JOIN va giu dieu kien quyen`, async t => {
      const query = t.mock.method(pool, 'query', async () => ({ rows: [opportunity] }));
      const result = detail ? await repo.getByIdForUser(10, actor) : await repo.getAll(actor);
      assert.deepEqual(result, detail ? opportunity : [opportunity]);
      const [sql, params] = query.mock.calls[0].arguments;
      assert.match(sql, /c\.full_name AS customer_name/);
      assert.match(sql, /p\.product_name/);
      assert.match(sql, /c\.phone AS customer_phone/);
      assert.match(sql, /JOIN customer AS c ON c\.customer_id = o\.customer_id/);
      assert.match(sql, /JOIN product AS p ON p\.product_id = o\.product_id/);
      assert.match(sql, detail ? /WHERE o\.opportunity_id = \$1\s+AND owner\.store_id = \$2/ : /WHERE owner\.store_id = \$1/);
      assert.match(sql, detail
        ? /\$3 = 'MANAGER'\s+OR \(\$3 = 'SALES' AND o\.owner_id = \$4\)/
        : /\$2 = 'MANAGER'\s+OR \(\$2 = 'SALES' AND o\.owner_id = \$3\)/);
      assert.deepEqual(params, detail
        ? [10, actor.store_id, actor.role, actor.user_id]
        : [actor.store_id, actor.role, actor.user_id, null]);
    });
  }
}

for (const [phone, masked] of [
  ['0900000123', '090****123'], ['12345678', '123**678'],
  ['1234567', '*******'], ['', ''], [null, null], [undefined, undefined]
]) {
  test(`QT-15: che so o ca danh sach va chi tiet, do dai ${phone?.length ?? 'nullish'}`, async t => {
    const row = { ...opportunity, customer_phone: phone };
    t.mock.method(repo, 'getAll', async () => [row]);
    t.mock.method(repo, 'getByIdForUser', async () => row);
    for (const actor of [sales, manager]) {
      const expected = { ...row, customer_phone: actor.role === 'MANAGER' ? phone : masked };
      assert.deepEqual(await service.getAllOpportunities(actor), [expected]);
      assert.deepEqual(await service.getOpportunityById(10, actor), expected);
    }
    assert.equal(row.customer_phone, phone, 'Khong thay doi du lieu repository');
  });
}

test('FR8 repository: stage duoc truyen bang tham so SQL cung dieu kien quyen', async t => {
  const query = t.mock.method(pool, 'query', async () => ({ rows: [] }));
  for (const actor of [sales, manager]) {
    for (const stage of ['TIEP_CAN', 'TU_VAN', 'BAO_GIA', 'CHOT']) {
      await repo.getAll(actor, stage);
      const [sql, params] = query.mock.calls.at(-1).arguments;
      assert.match(sql, /AND \(\$4::varchar IS NULL OR o\.stage = \$4\)/);
      assert.deepEqual(params, [actor.store_id, actor.role, actor.user_id, stage]);
    }
  }
});

test('FR8 service: loc va bo loc van truyen tai khoan va che so', async t => {
  const read = t.mock.method(repo, 'getAll', async () => [opportunity]);
  for (const actor of [sales, manager]) {
    for (const stage of [undefined, 'TIEP_CAN', 'TU_VAN', 'BAO_GIA', 'CHOT']) {
      const rows = await service.getAllOpportunities(actor, stage);
      assert.deepEqual(read.mock.calls.at(-1).arguments, [actor, stage]);
      assert.equal(rows[0].customer_phone, actor.role === 'SALES' ? '090****123' : opportunity.customer_phone);
    }
  }
});

test('FR8 service: stage sai/rong/mang/object bi chan truoc truy van', async t => {
  const read = t.mock.method(repo, 'getAll', async () => []);
  for (const stage of ['ABC', '', 'tu_van', null, ['TU_VAN'], { stage: 'TU_VAN' }]) {
    await assert.rejects(() => service.getAllOpportunities(sales, stage), { message: 'INVALID_STAGE' });
  }
  assert.equal(read.mock.callCount(), 0);
});

test('FR2: danh sach rong', async t => {
  t.mock.method(repo, 'getAll', async () => []);
  assert.deepEqual(await service.getAllOpportunities(sales), []);
});

for (const actor of [undefined, { ...sales, role: 'ADMIN' }, { ...sales, store_id: null }]) {
  test(`FR2/FR3: chan tai khoan khong hop le ${JSON.stringify(actor)}`, async t => {
    const list = t.mock.method(repo, 'getAll', async () => []);
    const detail = t.mock.method(repo, 'getByIdForUser', async () => undefined);
    await assert.rejects(() => service.getAllOpportunities(actor), { message: 'FORBIDDEN' });
    await assert.rejects(() => service.getOpportunityById(10, actor), { message: 'FORBIDDEN' });
    assert.equal(list.mock.callCount(), 0);
    assert.equal(detail.mock.callCount(), 0);
  });
}

test('FR2/FR3 HTTP: phan hoi va bao mat voi repository pham vi gia lap', async t => {
  const actors = {
    sales, manager,
    sales02: { ...sales, user_id: 3 },
    sales03: { ...sales, user_id: 4, store_id: 2 },
    manager02: { ...manager, user_id: 5, store_id: 2 }
  };
  t.mock.method(auth, 'authenticateToken', async token => {
    if (!actors[token]) throw new Error('UNAUTHENTICATED');
    return actors[token];
  });
  // Mo phong ket qua truy van da loc quyen; test SQL/params nam o tren.
  const visible = actor => actor.store_id === 1 && (actor.role === 'MANAGER' || actor.user_id === 1);
  const listRead = t.mock.method(repo, 'getAll', async (actor, stage) => visible(actor) && (!stage || opportunity.stage === stage) ? [opportunity] : []);
  t.mock.method(repo, 'getByIdForUser', async (id, actor) => String(id) === '10' && visible(actor) ? opportunity : undefined);
  const app = express();
  app.use('/api/opportunities', router);
  const server = app.listen(0, '127.0.0.1');
  t.after(() => new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve())));
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/opportunities`;
  const get = (path, token) => fetch(base + path, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  for (const token of ['sales', 'manager']) {
    for (const stage of ['TIEP_CAN', 'TU_VAN', 'BAO_GIA', 'CHOT']) {
      const filtered = await get(`?stage=${stage}`, token);
      assert.equal(filtered.status, 200);
      const rows = await filtered.json();
      assert.equal(rows.length, stage === opportunity.stage ? 1 : 0);
      assert.deepEqual(listRead.mock.calls.at(-1).arguments, [actors[token], stage]);
    }
    for (const query of ['?stage=ABC', '?stage=', '?stage=TU_VAN&stage=CHOT']) {
      const count = listRead.mock.callCount();
      const invalid = await get(query, token);
      assert.equal(invalid.status, 400);
      assert.deepEqual(await invalid.json(), { message: 'INVALID_STAGE' });
      assert.equal(listRead.mock.callCount(), count);
    }
    for (const path of ['', '/10']) {
      const response = await get(path, token);
      assert.equal(response.status, 200);
      const data = await response.json();
      const row = path ? data : data[0];
      assert.deepEqual(row, { ...opportunity, customer_phone: token === 'manager' ? '0900000123' : '090****123' });
    }
  }
  for (const token of ['sales02', 'sales03', 'manager02']) {
    const filtered = await get('?stage=TIEP_CAN', token);
    assert.equal(filtered.status, 200);
    assert.deepEqual(await filtered.json(), []);
    const list = await get('', token);
    assert.equal(list.status, 200);
    assert.deepEqual(await list.json(), []);
    const detail = await get('/10', token);
    assert.equal(detail.status, 404);
    assert.deepEqual(await detail.json(), { message: 'OPPORTUNITY_NOT_FOUND' });
  }
  const missing = await get('/999999', 'sales');
  assert.equal(missing.status, 404);
  assert.deepEqual(await missing.json(), { message: 'OPPORTUNITY_NOT_FOUND' });
  for (const path of ['', '/10']) {
    const unauthenticated = await get(path);
    assert.equal(unauthenticated.status, 401);
    assert.deepEqual(await unauthenticated.json(), { message: 'UNAUTHENTICATED' });
  }
});
