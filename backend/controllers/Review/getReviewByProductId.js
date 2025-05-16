const review = require("../../models/review")

const getReviewByProductId = async (req, res) => {
    try {
        if(!req.params.productId){
            throw new Error("Product Id not provided")
        }
        const getReviewByProductId = await review.find({productId:req.params.productId}).populate(
            {
                path:"userId",
                select:"_id firstName lastName"
            }
        ).select("-productId")
        return res.status(200).json({status:true , getReviewByProductId:getReviewByProductId})
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = getReviewByProductId