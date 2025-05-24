const product = require("../../models/product")

const getProductsByCategoryId = async (req, res) => {
    try {
        if (!req.params.categoryId) {
            throw new Error("CategoryId not found")
        }
        const findProductsByCategoryId = await product.find({ categoryId: req.params.categoryId })
            .populate(
                {
                    path: "categoryId",
                    select: "title -_id"
                }
            )
            .populate(
                {
                    path: "adminId",
                    select: "-password"
                }

            )
        return res.status(200).json({ status: true, products: findProductsByCategoryId })
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}


module.exports = getProductsByCategoryId