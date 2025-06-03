const Order = require("../../models/order");
const OrderedProduct = require("../../models/orderedProduct");

const updateOrderStatus_ProductStatusByOrderId = async (req, res) => {
    try {
        if (!req.params.orderId) {
            return res.status(400).json({ error: 'orderStatus is required' });
        }
        if (!req.params.status) {
            return res.status(400).json({ error: 'orderStatus is required' });
        }
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { orderStatus:req.params.status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Step 2: Update all related OrderedProducts (except cancelled)
        const result = await OrderedProduct.updateMany(
            {
                orderId:req.params.orderId,
                status: { $ne: 'cancelled' }
            },
            {
                $set: { status: req.params.status }
            }
        );

        return res.status(200).json({
            message: 'Order status and product statuses updated successfully',
            updatedOrderStatus: order.orderStatus,
            updatedProductsCount: result.modifiedCount
        });
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = updateOrderStatus_ProductStatusByOrderId