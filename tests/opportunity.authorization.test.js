const test = require('node:test');
const assert = require('node:assert/strict');
const service = require('../src/services/opportunity.service');
const repo = require('../src/repositories/opportunity.repository');
const user = { user_id: 1, store_id: 1, role: 'SALES' };
const actions = [
  ['xoa', u => service.deleteOpportunity(53, u), 'remove'],
  ['chuyen giai doan', u => service.updateOpportunityStage(53, 'TU_VAN', u), 'updateStage'],
  ['ghi ket qua', u => service.updateOpportunityResult(53, 'THANH_CONG', null, u), 'updateResult']
];
for (const [name, action, method] of actions) {
  for (const actor of [undefined, {...user, role: 'MANAGER'}]) {
    test(`Tu choi ${name}: ${actor ? 'MANAGER' : 'thieu tai khoan'}`, async t => {
      const write = t.mock.method(repo, method, async () => { throw Error('MUST_NOT_WRITE'); });
      await assert.rejects(() => action(actor), {message:'FORBIDDEN'});
      assert.equal(write.mock.callCount(), 0);
    });
  }
  test(`Tu choi ${name} ngoai pham vi va khong ghi`, async t => {
    const read = t.mock.method(repo, 'getByIdForUser', async () => undefined);
    const write = t.mock.method(repo, method, async () => { throw Error('MUST_NOT_WRITE'); });
    await assert.rejects(() => action(user), {message:'OPPORTUNITY_NOT_FOUND'});
    assert.deepEqual(read.mock.calls[0].arguments, [53, user]);
    assert.equal(write.mock.callCount(), 0);
  });
}
