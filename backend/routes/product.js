const express = require("express")
const router = express.Router()
const addProduct = require("../controllers/Product/addProduct")
const authenticateAdmin = require("../middlwares/authenticateAdmin")
const updateProduct = require("../controllers/Product/updateProduct")
const deleteProduct = require("../controllers/Product/deleteProduct")
const getAllProducts = require("../controllers/Product/getAllProducts")
const getProductById = require("../controllers/Product/getProductById")

// POST /api/product             → Create product
router.post("/", authenticateAdmin, addProduct);

// GET /api/product              → Get all products
router.get("/", getAllProducts);

// GET /api/product/:categoryId → Get products by category
router.get("/:id", getProductById);

// PATCH /api/product/:id       → Update product
router.patch("/:id", authenticateAdmin, updateProduct);

// DELETE /api/product/:id      → Delete product
router.delete("/:id", authenticateAdmin, deleteProduct);

module.exports = router