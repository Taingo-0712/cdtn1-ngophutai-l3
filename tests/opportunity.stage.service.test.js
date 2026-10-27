const test = require("node:test");
const assert = require("node:assert/strict");
const service = require("../src/services/opportunity.service");
const repository = require("../src/repositories/opportunity.repository");

// Giả lập hợp đồng updateStage; không xác nhận repository đã triển khai hàm này.
function stubRepository(t, existing) {
  const originalUpdateStage = Object.getOwnPropertyDescriptor(repository, "updateStage");
  t.after(() => {
    if (originalUpdateStage) {
      Object.defineProperty(repository, "updateStage", originalUpdateStage);
    } else {
      delete repository.updateStage;
    }
  });
  const getById = t.mock.method(repository, "getById", async () => existing);
  const updateStage = t.mock.fn(async (id, stage) => ({ opportunity_id: id, stage }));
  repository.updateStage = updateStage;
  return { getById, updateStage };
}

// US5/FR5: chuyển đúng từng bước và trả dữ liệu repository.
for (const [from, to] of [
  ["TIEP_CAN", "TU_VAN"],
  ["TU_VAN", "BAO_GIA"],
  ["BAO_GIA", "CHOT"]
]) {
  test(`Cho phep ${from} -> ${to}`, async (t) => {
    const mocks = stubRepository(t, { opportunity_id: 1, stage: from });
    assert.deepEqual(await service.updateOpportunityStage(1, to), {
      opportunity_id: 1,
      stage: to
    });
    assert.deepEqual(mocks.getById.mock.calls[0].arguments, [1]);
    assert.equal(mocks.updateStage.mock.callCount(), 1);
    assert.deepEqual(mocks.updateStage.mock.calls[0].arguments, [1, to]);
  });
}

// US5/FR5, BR3: bỏ bước, giữ nguyên, quay lại và vượt giai đoạn cuối.
for (const [from, to] of [
  ["TIEP_CAN", "BAO_GIA"],
  ["TU_VAN", "TU_VAN"],
  ["BAO_GIA", "TU_VAN"],
  ["CHOT", "TIEP_CAN"]
]) {
  test(`Tu choi ${from} -> ${to} va khong ghi du lieu`, async (t) => {
    const { updateStage } = stubRepository(t, { opportunity_id: 1, stage: from });
    await assert.rejects(() => service.updateOpportunityStage(1, to), {
      message: "INVALID_STAGE_TRANSITION"
    });
    assert.equal(updateStage.mock.callCount(), 0);
  });
}

test("Tu choi giai doan ngoai danh muc truoc khi truy van", async (t) => {
  const { getById, updateStage } = stubRepository(t, { stage: "TIEP_CAN" });
  await assert.rejects(() => service.updateOpportunityStage(1, "UNKNOWN"), {
    message: "INVALID_STAGE"
  });
  assert.equal(getById.mock.callCount(), 0);
  assert.equal(updateStage.mock.callCount(), 0);
});

test("Tu choi co hoi khong ton tai va khong ghi du lieu", async (t) => {
  const { updateStage } = stubRepository(t, undefined);
  await assert.rejects(() => service.updateOpportunityStage(999, "TU_VAN"), {
    message: "OPPORTUNITY_NOT_FOUND"
  });
  assert.equal(updateStage.mock.callCount(), 0);
});
