const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "../src/services/product.service.js"),
  "utf8"
);

// Nạp Service với Repository giả để không tác động database.
function createService(repository) {
  const moduleStub = { exports: {} };

  vm.runInNewContext(source, {
    module: moduleStub,
    require(name) {
      if (name !== "../repositories/product.repository") {
        throw new Error("UNEXPECTED_DEPENDENCY");
      }
      return repository;
    }
  });

  return moduleStub.exports;
}

test("[Luồng đúng] Tạo sản phẩm và bỏ khoảng trắng đầu/cuối", async () => {
  const service = createService({
    create: async (data) => ({ product_id: "10", ...data })
  });

  const result = await service.createProduct({
    product_code: " SP10 ",
    product_name: " Điện thoại thử "
  });

  assert.equal(result.product_id, "10");
  assert.equal(result.product_code, "SP10");
  assert.equal(result.product_name, "Điện thoại thử");
});

test("[Giá trị biên] Chấp nhận mã 30 và tên 150 ký tự", async () => {
  const service = createService({
    create: async (data) => data
  });

  const result = await service.createProduct({
    product_code: "A".repeat(30),
    product_name: "B".repeat(150)
  });

  assert.equal(result.product_code.length, 30);
  assert.equal(result.product_name.length, 150);
});

test("[Giá trị biên] Từ chối mã dài 31 ký tự trước khi lưu", async () => {
  let saved = false;
  const service = createService({
    create: async () => { saved = true; }
  });

  await assert.rejects(
    () => service.createProduct({
      product_code: "A".repeat(31),
      product_name: "Điện thoại thử"
    }),
    { message: "INVALID_PRODUCT_CODE" }
  );

  assert.equal(saved, false);
});

test("[Dữ liệu sai] Tên chỉ có khoảng trắng không được lưu", async () => {
  let saved = false;
  const service = createService({
    create: async () => { saved = true; }
  });

  await assert.rejects(
    () => service.createProduct({
      product_code: "SP10",
      product_name: "   "
    }),
    { message: "INVALID_PRODUCT_NAME" }
  );

  assert.equal(saved, false);
});

test("[Dữ liệu sai] Không cập nhật khi body rỗng", async () => {
  let updated = false;
  const service = createService({
    update: async () => { updated = true; }
  });

  await assert.rejects(
    () => service.updateProduct("10", {}),
    { message: "EMPTY_PRODUCT_UPDATE" }
  );

  assert.equal(updated, false);
});

test("[Dữ liệu sai] Trùng mã được đổi thành lỗi rõ ràng", async () => {
  const service = createService({
    create: async () => {
      const error = new Error("duplicate key");
      error.code = "23505";
      throw error;
    }
  });

  await assert.rejects(
    () => service.createProduct({
      product_code: "SP10",
      product_name: "Điện thoại thử"
    }),
    { message: "PRODUCT_CODE_EXISTS" }
  );
});
