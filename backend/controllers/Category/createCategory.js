const { validationResult } = require("express-validator")
const category = require("../../models/category")

const createCategory = async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.errors.length) {
            const err = result.errors.reduce(function (acc, erritem) {
                return { ...acc, [erritem.path]: erritem.msg }
            }, {})
            return res.status(422).json({ status: false, error: err })
        }
        const checkCategoryExists = await category.findOne({ title: {$regex:req.body.title , $options:"i"} })                
        if (checkCategoryExists) {
            throw new Error("Category already exists")
        }
        const newCategory = new category(req.body)
        const saveCategory = await newCategory.save()
        if (!saveCategory) {
            throw new Error("Error occured while creating category")
        }
        return res.status(200).json({ status: true, msg: "Category Added Successfully", category: saveCategory })
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}


module.exports = createCategory