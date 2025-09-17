const category = require("../../models/category")

const getAllCategory = async (req, res) => {
    try {
        const categories = await category.find();
        return res.status(200).json({status: true, categories})
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = getAllCategory