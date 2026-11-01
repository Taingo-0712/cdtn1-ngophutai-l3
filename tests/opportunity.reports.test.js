const test = require('node:test');
const assert = require('node:assert/strict');
const service = require('../src/services/opportunity.service');
const repo = require('../src/repositories/opportunity.repository');
const manager = {user_id:2,store_id:1,role:'MANAGER'};
test('Pheu chan SALES truoc truy van',async t=>{
 const read=t.mock.method(repo,'getFunnel',async()=>[]);
 await assert.rejects(()=>service.getFunnel({...manager,role:'SALES'}),{message:'FORBIDDEN'});
 assert.equal(read.mock.callCount(),0);
});
test('Pheu du 4 giai doan va truyen dung cua hang',async t=>{
 const read=t.mock.method(repo,'getFunnel',async()=>[{stage:'TU_VAN',count:'3'}]);
 const data=await service.getFunnel(manager);
 assert.deepEqual(data.map(x=>x.count),[0,3,0,0]);
 assert.deepEqual(read.mock.calls[0].arguments,[1]);
});
test('Pheu rong van co 4 so 0',async t=>{
 t.mock.method(repo,'getFunnel',async()=>[]);
 assert.deepEqual((await service.getFunnel(manager)).map(x=>x.count),[0,0,0,0]);
});
test('Lich su ngoai quyen khong duoc truy van',async t=>{
 t.mock.method(repo,'getByIdForUser',async()=>undefined);
 const history=t.mock.method(repo,'getHistory',async()=>[]);
 await assert.rejects(()=>service.getHistory(5,manager),{message:'OPPORTUNITY_NOT_FOUND'});
 assert.equal(history.mock.callCount(),0);
});
test('Co hoi hop le chua chuyen tra lich su rong',async t=>{
 t.mock.method(repo,'getByIdForUser',async()=>({opportunity_id:5}));
 const history=t.mock.method(repo,'getHistory',async()=>[]);
 assert.deepEqual(await service.getHistory(5,manager),[]);
 assert.deepEqual(history.mock.calls[0].arguments,[5,manager]);
});
