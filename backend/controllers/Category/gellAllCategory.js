const category = require("../../models/category")

const getAllCategory = async (req, res) => {
    try {
        return res.status(200).json({status:true , categoryList:await category.find()})
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = getAllCategory