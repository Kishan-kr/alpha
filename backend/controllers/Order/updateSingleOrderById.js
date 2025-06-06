const OrderedProduct = require("../../models/orderedProduct");

const updateSingleOrderById = async (req, res) => {
    try {
        //checking userid === middleware authenticate user
        const updatedProduct = await OrderedProduct.findByIdAndUpdate(
            req.params.id,
            {status:req.params.status , cancelledAt: new Date()},
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Ordered product not found' });
        }

        return res.status(200).json({
            message: 'Ordered product updated successfully',
            orderedProduct: updatedProduct
        });
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}


module.exports = updateSingleOrderById