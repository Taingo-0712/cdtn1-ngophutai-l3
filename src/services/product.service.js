const productRepository = require("../repositories/product.repository");

function validateId(id) {
  const validType =
    typeof id === "string" ||
    (typeof id === "number" && Number.isSafeInteger(id));

  if (!validType || !/^[1-9]\d*$/.test(String(id))) {
    throw new Error("INVALID_PRODUCT_ID");
  }

  if (BigInt(id) > 9223372036854775807n) {
    throw new Error("INVALID_PRODUCT_ID");
  }

  return String(id);
}

function validateData(data, partial = false) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("INVALID_PRODUCT_DATA");
  }

  const allowedFields = ["product_code", "product_name"];
  const keys = Object.keys(data);

  if (keys.some((key) => !allowedFields.includes(key))) {
    throw new Error("INVALID_PRODUCT_DATA");
  }

  if (partial && keys.length === 0) {
    throw new Error("EMPTY_PRODUCT_UPDATE");
  }

  const normalized = {};
  const limits = { product_code: 30, product_name: 150 };

  for (const field of allowedFields) {
    if (partial && !Object.hasOwn(data, field)) continue;

    const value = data[field];

    if (typeof value !== "string") {
      throw new Error(
        field === "product_code"
          ? "INVALID_PRODUCT_CODE"
          : "INVALID_PRODUCT_NAME"
      );
    }

    const text = value.trim();
    const length = [...text].length;

    if (length === 0 || length > limits[field]) {
      throw new Error(
        field === "product_code"
          ? "INVALID_PRODUCT_CODE"
          : "INVALID_PRODUCT_NAME"
      );
    }

    normalized[field] = text;
  }

  return normalized;
}

async function saveProduct(operation) {
  try {
    return await operation();
  } catch (error) {
    // PostgreSQL: vi phạm ràng buộc UNIQUE.
    if (error.code === "23505") {
      throw new Error("PRODUCT_CODE_EXISTS");
    }

    throw error;
  }
}

async function getAllProducts() {
  return productRepository.getAll();
}

async function getProductById(id) {
  const product = await productRepository.getById(validateId(id));

  if (!product) throw new Error("PRODUCT_NOT_FOUND");

  return product;
}

async function createProduct(data) {
  const normalized = validateData(data);

  return saveProduct(() => productRepository.create(normalized));
}

async function updateProduct(id, data) {
  const productId = validateId(id);
  const normalized = validateData(data, true);

  const product = await saveProduct(() =>
    productRepository.update(productId, normalized)
  );

  if (!product) throw new Error("PRODUCT_NOT_FOUND");

  return product;
}

async function deleteProduct(id) {
  const product = await productRepository.remove(validateId(id));

  if (!product) throw new Error("PRODUCT_NOT_FOUND");

  return product;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
