const product = require("../../models/product")

const addProduct = async (req, res) => {
    try {
        const isProductTitleExists = await product.findOne({ title: { $regex: req.body.title, $options: 'i' } })
        if (isProductTitleExists) {
            throw new Error("Product with this title already exists")
        }
        const newproduct = new product({...req.body , adminId:req.admin.id})
        const saveproduct = await newproduct.save()
        if (!saveproduct) {
            throw new Error("Error occured while saving product")
        }
        return res.status(200).json({ status: true, msg: "product saved" })
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}


module.exports = addProduct