const express = require("express")
const router = express.Router()
const addProduct = require("../controllers/Product/addProduct")
const authenticateAdmin = require("../middlwares/authenticateAdmin")
const updateProduct = require("../controllers/Product/updateProduct")
const deleteProduct = require("../controllers/Product/deleteProduct")
const getAllProducts = require("../controllers/Product/getAllProducts")
const getProductBySlug = require("../controllers/Product/getProductBySlug")
const { getStocksOfAll } = require("../controllers/Product/getStocksOfAll")
const { getStockById } = require("../controllers/Product/getStockById")

// POST /api/products             → Create product
router.post("/", authenticateAdmin, addProduct);

// GET /api/products              → Get all products
router.get("/", getAllProducts);

// GET /api/products/:slug → Get products by slug
router.get("/:slug", getProductBySlug);

// PATCH /api/products/:id       → Update product
router.patch("/:id", authenticateAdmin, updateProduct);

// DELETE /api/products/:id      → Delete product
router.delete("/:id", authenticateAdmin, deleteProduct);

// POST /api/products/stocks       → Get stock of all cart products
router.post("/stocks", getStocksOfAll);

// GET /api/products/stocks/:id       → Get stock of a product by id
router.get("/stocks/:id", getStockById);

module.exports = router