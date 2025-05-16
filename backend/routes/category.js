const express = require("express")
const authenticateAdmin = require("../middlwares/authenticateAdmin")
const createCategory = require("../controllers/Category/createCategory")
const { body } = require("express-validator")
const getAllCategory = require("../controllers/Category/gellAllCategory")
const deleteCategory = require("../controllers/Category/deleteCategory")
const router = express.Router()


//create category
router.post("/create-category" , authenticateAdmin , [
   body("title").isLength({min:3}).withMessage("Title must be of 3 characters") , 
   body("description").isLength({min:10}).withMessage("Description must be of 10 characters") , 
],createCategory)



//get All Category
router.get("/get-AllCategory" , authenticateAdmin , getAllCategory)


//delete category by ID
router.delete("/delete-category/:id"  , authenticateAdmin , deleteCategory)
module.exports=router