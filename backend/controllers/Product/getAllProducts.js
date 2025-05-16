const product = require("../../models/product");

const getAllProducts = async (req, res) => {
    try {
        return res.status(200).json({
            status: true, productsList: await product.find().populate(
                {
                    path:"adminId",
                    select:"-password"
                }
            )
        })
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
}


module.exports = getAllProducts