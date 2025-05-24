const express = require("express")
const router = express.Router()
const addProduct = require("../controllers/Product/addProduct")
const authenticateAdmin = require("../middlwares/authenticateAdmin")
const updateProduct = require("../controllers/Product/updateProduct")
const deleteProduct = require("../controllers/Product/deleteProduct")
const getAllProducts = require("../controllers/Product/getAllProducts")
const isRoleExists = require("../middlwares/isRoleExists")
const getProductsByCategoryId = require("../controllers/Product/getProductsByCategoryId")


//create product
router.post("/add-product" , authenticateAdmin, isRoleExists, addProduct)

//get all products
router.get("/get-products" , getAllProducts)

//get all products by categoryId
router.get("/get-Products/:categoryId" , getProductsByCategoryId)

//update product
router.patch("/update-product/:id" , authenticateAdmin , isRoleExists, updateProduct )

//delete product
router.delete("/delete-product/:id" , authenticateAdmin , isRoleExists, deleteProduct)


module.exports = router