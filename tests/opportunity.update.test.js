const test = require('node:test');
const assert = require('node:assert/strict');
const pool = require('../src/db');
const service = require('../src/services/opportunity.service');
const repository = require('../src/repositories/opportunity.repository');

const sales = { user_id: 1, store_id: 2, role: 'SALES' };

test('FR4 từ chối dữ liệu sai và MANAGER trước khi ghi', async t => {
  const write = t.mock.method(repository, 'updateForOwner', async () => {});

  for (const [body, message] of [
    [{ product_id: '9223372036854775808', need_desc: 'Nhu cầu mới' }, 'INVALID_PRODUCT_ID'],
    [{ product_id: null }, 'INVALID_PRODUCT_ID'],
    [{ product_id: '2', expected_value: -1 }, 'INVALID_EXPECTED_VALUE'],
    [{ expected_value: 1.5 }, 'INVALID_EXPECTED_VALUE'],
    [{ expected_value: '1000000000000000' }, 'INVALID_EXPECTED_VALUE'],
    [{ product_id: '2', need_desc: '  ' }, 'INVALID_NEED_DESC'],
    [{ product_id: '2', owner_id: 9 }, 'INVALID_OPPORTUNITY_DATA'],
  ]) {
    await assert.rejects(service.updateOpportunity('10', body, sales), { message });
  }
  await assert.rejects(
    service.updateOpportunity('10', { product_id: '2' }, { ...sales, role: 'MANAGER' }),
    { message: 'FORBIDDEN' }
  );
  assert.equal(write.mock.callCount(), 0);
});

function mockTransaction(t, { opportunity = { stage: 'CHOT', result: null }, product = true } = {}) {
  const calls = [];
  const updated = { opportunity_id: '10', product_id: '3', result: null };
  const client = {
    query: async (sql, params) => {
      const statement = sql.trim().replace(/\s+/g, ' ');
      calls.push({ statement, params });
      if (statement.startsWith('SELECT o.result')) return { rows: opportunity ? [opportunity] : [] };
      if (statement.startsWith('SELECT product_id')) return { rows: product ? [{ product_id: '3' }] : [] };
      if (statement.startsWith('UPDATE')) return { rows: [updated] };
      return { rows: [] };
    },
    release: t.mock.fn(),
  };
  t.mock.method(pool, 'connect', async () => client);
  t.mock.method(pool, 'query', async () => { throw new Error('TRANSACTION_MUST_USE_CLIENT'); });
  return { calls, updated, release: client.release };
}

test('FR4 tại Chốt chưa có kết quả vẫn sửa, khóa cơ hội và sản phẩm trong cùng transaction', async t => {
  const { calls, updated, release } = mockTransaction(t);
  assert.deepEqual(await service.updateOpportunity('10', {
    product_id: '3', need_desc: '  Mua điện thoại  ', expected_value: '0',
  }, sales), updated);

  assert.equal(calls.length, 5);
  assert.equal(calls[0].statement, 'BEGIN');
  assert.match(calls[1].statement, /o\.owner_id = \$2 AND owner\.store_id = \$3 FOR UPDATE OF o$/);
  assert.deepEqual(calls[1].params, ['10', 1, 2]);
  assert.match(calls[2].statement, /is_active = TRUE FOR SHARE$/);
  assert.deepEqual(calls[2].params, ['3']);
  assert.match(calls[3].statement, /^UPDATE opportunity SET product_id = COALESCE/);
  assert.deepEqual(calls[3].params, ['3', 'Mua điện thoại', 0, '10']);
  assert.equal(calls[4].statement, 'COMMIT');
  assert.equal(release.mock.callCount(), 1);
});

test('FR4 sửa nhu cầu mà giữ sản phẩm cũ, kể cả sản phẩm đã ngừng sử dụng', async t => {
  const { calls } = mockTransaction(t, { product: false });
  await service.updateOpportunity('10', { need_desc: 'Nhu cầu mới' }, sales);
  assert.equal(calls.length, 4);
  assert.deepEqual(calls[2].params, [null, 'Nhu cầu mới', null, '10']);
  assert.equal(calls[3].statement, 'COMMIT');
});

for (const [label, state, message] of [
  ['ngoài phạm vi', { opportunity: null }, 'OPPORTUNITY_NOT_FOUND'],
  ['đã có kết quả Thành công khi nhận khóa', { opportunity: { result: 'THANH_CONG' } }, 'OPPORTUNITY_FINALIZED'],
  ['đã có kết quả Thất bại khi nhận khóa', { opportunity: { result: 'THAT_BAI' } }, 'OPPORTUNITY_FINALIZED'],
  ['sản phẩm không khả dụng', { product: false }, 'INVALID_PRODUCT_ID'],
]) {
  test(`FR4 rollback ${label} và giữ toàn bộ dữ liệu`, async t => {
    const { calls, release } = mockTransaction(t, state);
    await assert.rejects(service.updateOpportunity('10', {
      product_id: '3', need_desc: 'Nhu cầu mới', expected_value: 2000,
    }, sales), { message });
    assert.equal(calls.some(({ statement }) => statement.startsWith('UPDATE')), false);
    assert.equal(calls.at(-1).statement, 'ROLLBACK');
    assert.equal(release.mock.callCount(), 1);
  });
}

test('TC-02 FR4 tu choi gia tri co hoi am -1', async (t) => {
  const write = t.mock.method(
    repository,
    'updateForOwner',
    async () => {}
  );

  await assert.rejects(
    service.updateOpportunity(
      '10',
      { product_id: '2', expected_value: -1 },
      sales
    ),
    { message: 'INVALID_EXPECTED_VALUE' }
  );

  assert.equal(write.mock.callCount(), 0);
});
