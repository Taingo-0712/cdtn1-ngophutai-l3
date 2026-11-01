const express = require("express");
const router = express.Router();
const productService = require("../services/product.service");

router.get("/", async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Bộ xử lý lỗi dùng chung cho các route sản phẩm.
router.use((error, req, res, next) => {
  const badRequestErrors = [
    "INVALID_PRODUCT_ID",
    "INVALID_PRODUCT_DATA",
    "INVALID_PRODUCT_CODE",
    "INVALID_PRODUCT_NAME",
    "EMPTY_PRODUCT_UPDATE"
  ];

  if (badRequestErrors.includes(error.message)) {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === "PRODUCT_NOT_FOUND") {
    return res.status(404).json({ message: error.message });
  }

  if (error.message === "PRODUCT_CODE_EXISTS") {
    return res.status(409).json({ message: error.message });
  }

  return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
});

module.exports = router;
