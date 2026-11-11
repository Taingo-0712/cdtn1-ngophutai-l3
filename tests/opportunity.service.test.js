const test = require("node:test");
const assert = require("node:assert/strict");

const opportunityService = require("../src/services/opportunity.service");
const opportunityRepository = require("../src/repositories/opportunity.repository");

test("Khong cho phep tao co hoi khi expected_value < 0", async () => {
  const originalCreate = opportunityRepository.create;

  opportunityRepository.create = async () => {
    throw new Error("KHONG_DUOC_GOI_REPOSITORY");
  };

  await assert.rejects(
    () =>
      opportunityService.createOpportunity({
        customer_id: 1,
        product_id: 1,
        owner_id: 1,
        need_desc: "Khach hang quan tam san pham",
        expected_value: -1000
      }, {
        user_id: "1",
        store_id: "1",
        role: "SALES"
      }),
    {
      message: "INVALID_EXPECTED_VALUE"
    }
  );

  opportunityRepository.create = originalCreate;
});

test("BUG-02: Tu choi gia tri thap phan khi tao co hoi", async (t) => {
  const write = t.mock.method(
    opportunityRepository,
    "create",
    async () => ({ opportunity_id: 999 })
  );

  await assert.rejects(
    opportunityService.createOpportunity(
      {
        customer_id: 1,
        product_id: 1,
        need_desc: "Kiem thu BUG-02",
        expected_value: 1.5
      },
      {
        user_id: 1,
        store_id: 1,
        role: "SALES"
      }
    ),
    { message: "INVALID_EXPECTED_VALUE" }
  );

  assert.equal(write.mock.callCount(), 0);
});
