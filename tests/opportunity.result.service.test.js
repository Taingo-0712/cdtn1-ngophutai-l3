const test = require("node:test");
const assert = require("node:assert/strict");
const service = require("../src/services/opportunity.service");
const repository = require("../src/repositories/opportunity.repository");

// US6/FR6, BR4: kiểm thử nghiệp vụ với repository giả lập, không ghi PostgreSQL.
function stubRepository(t, existing = { stage: "CHOT", result: null }) {
  const getById = t.mock.method(repository, "getById", async () => existing);
  const updateResult = t.mock.method(repository, "updateResult", async (id, result, reason) => ({
    opportunity_id: id,
    stage: "CHOT",
    result,
    failure_reason: reason
  }));
  return { getById, updateResult };
}

test("Ket qua ngoai danh muc bi tu choi truoc khi truy van", async (t) => {
  const { getById, updateResult } = stubRepository(t);
  for (const result of ["UNKNOWN", "", null, undefined, 1]) {
    await assert.rejects(() => service.updateOpportunityResult(1, result), {
      message: "INVALID_RESULT"
    });
  }
  assert.equal(getById.mock.callCount(), 0);
  assert.equal(updateResult.mock.callCount(), 0);
});

test("Co hoi khong ton tai: khong ghi ket qua", async (t) => {
  const { updateResult } = stubRepository(t, null);
  await assert.rejects(() => service.updateOpportunityResult(999, "THANH_CONG"), {
    message: "OPPORTUNITY_NOT_FOUND"
  });
  assert.equal(updateResult.mock.callCount(), 0);
});

test("Chua den CHOT: khong ghi ket qua", async (t) => {
  const { updateResult } = stubRepository(t, { stage: "BAO_GIA", result: null });
  await assert.rejects(() => service.updateOpportunityResult(1, "THANH_CONG"), {
    message: "OPPORTUNITY_NOT_AT_CHOT"
  });
  assert.equal(updateResult.mock.callCount(), 0);
});

test("Khong ghi de ket qua da co", async (t) => {
  const { getById, updateResult } = stubRepository(t);
  for (const result of ["THANH_CONG", "THAT_BAI"]) {
    getById.mock.mockImplementation(async () => ({ stage: "CHOT", result }));
    await assert.rejects(() => service.updateOpportunityResult(1, "THANH_CONG"), {
      message: "RESULT_ALREADY_RECORDED"
    });
  }
  assert.equal(updateResult.mock.callCount(), 0);
});

test("THAT_BAI can ly do la chuoi khong rong sau trim", async (t) => {
  const { updateResult } = stubRepository(t);
  for (const reason of [undefined, null, 123, "", "   "]) {
    await assert.rejects(() => service.updateOpportunityResult(1, "THAT_BAI", reason), {
      message: "FAILURE_REASON_REQUIRED"
    });
  }
  assert.equal(updateResult.mock.callCount(), 0);
});

test("THAT_BAI luu ly do da trim va tra ban ghi moi", async (t) => {
  const { updateResult } = stubRepository(t);
  const updated = await service.updateOpportunityResult(1, "THAT_BAI", "  Khach chon san pham khac  ");
  assert.deepEqual(updateResult.mock.calls[0].arguments, [1, "THAT_BAI", "Khach chon san pham khac"]);
  assert.equal(updateResult.mock.callCount(), 1);
  assert.equal(updated.result, "THAT_BAI");
  assert.equal(updated.failure_reason, "Khach chon san pham khac");
});

test("THANH_CONG luu failure_reason la null", async (t) => {
  const { updateResult } = stubRepository(t);
  const updated = await service.updateOpportunityResult(1, "THANH_CONG", "Ly do cu");
  assert.deepEqual(updateResult.mock.calls[0].arguments, [1, "THANH_CONG", null]);
  assert.equal(updated.failure_reason, null);
});

test("Repository khong cap nhat duoc: bao xung dot, khong bao thanh cong", async (t) => {
  const { updateResult } = stubRepository(t);
  updateResult.mock.mockImplementation(async () => undefined);
  await assert.rejects(() => service.updateOpportunityResult(1, "THANH_CONG"), {
    message: "RESULT_UPDATE_CONFLICT"
  });
  assert.equal(updateResult.mock.callCount(), 1);
});

test("Loi repository duoc truyen len cho route xu ly", async (t) => {
  const { updateResult } = stubRepository(t);
  const failure = new Error("SIMULATED_DATABASE_ERROR");
  updateResult.mock.mockImplementation(async () => { throw failure; });
  await assert.rejects(() => service.updateOpportunityResult(1, "THANH_CONG"), failure);
});
