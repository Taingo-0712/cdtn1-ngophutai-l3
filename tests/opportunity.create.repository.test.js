const test = require("node:test");
const assert = require("node:assert/strict");

const pool = require("../src/db");
const repository = require("../src/repositories/opportunity.repository");

test("Tu choi tao co hoi voi san pham da ngung kinh doanh", async (t) => {
  // Giả lập kết quả PostgreSQL khi sản phẩm đã ngừng kinh doanh.
  t.mock.method(pool, "query", async (sql) => {
    const query = String(sql);

    // Câu INSERT có lọc sản phẩm đang hoạt động:
    // sản phẩm ngừng kinh doanh sẽ không tạo được bản ghi.
    if (
      /FROM\s+product\b/i.test(query) &&
      /is_active\s*=\s*TRUE/i.test(query)
    ) {
      return { rows: [] };
    }

    // Câu INSERT cũ không kiểm tra is_active:
    // giả lập việc PostgreSQL chấp nhận tạo cơ hội.
    return {
      rows: [{ opportunity_id: 20, product_id: 19 }]
    };
  });

  await assert.rejects(
    repository.create({
      customer_id: 1,
      product_id: 19,
      owner_id: 1,
      need_desc: "Kiem thu BUG-03",
      expected_value: 1000000
    }),
    { message: "INVALID_REFERENCE" }
  );
});
