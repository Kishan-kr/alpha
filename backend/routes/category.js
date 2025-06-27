const express = require("express")
const authenticateAdmin = require("../middlwares/authenticateAdmin")
const createCategory = require("../controllers/Category/createCategory")
const { body } = require("express-validator")
const getAllCategory = require("../controllers/Category/gellAllCategory")
const deleteCategory = require("../controllers/Category/deleteCategory")
const isRoleExists = require("../middlwares/isRoleExists")
const { upload, uploadCategoryThumbnail } = require("../middlwares/uploadImage")
const getCategoryById = require("../controllers/Category/getCategoryById")
const router = express.Router()


// create category
router.post("/" , authenticateAdmin,
   upload.single('thumbnail'),
   uploadCategoryThumbnail, [
   body("name").isLength({min:3}).withMessage("Name must be of at least 3 characters") , 
   body("description").isLength({min:10}).withMessage("Description must be of at least 10 characters") , 
], createCategory)



// get All Category
router.get("/"  , getAllCategory)


// get a Category by id
router.get("/:id"  , getCategoryById)


// delete category by ID
router.delete("/:id"  , authenticateAdmin, deleteCategory)

module.exports=router