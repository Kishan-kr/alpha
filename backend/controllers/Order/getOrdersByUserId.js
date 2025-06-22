const Order = require("../../models/order")

const getOrdersByUserId = async (req, res) => {
    try {
        const userId = "665a4e33abf67e001fda998e";

        const orders = await Order.find({ userId });
        if (!orders.length) {
            return res.status(200).json({ message: 'no orders' });
        }

        const orderIds = orders.map(order => order._id);
        const orderData = await Order.aggregate([
            { $match: { _id: { $in: orderIds } } },

            // Lookup ordered products
            {
                $lookup: {
                    from: 'orderedproducts',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'products'
                }
            },

            // Unwind products array to join each product separately
            { $unwind: { path: '$products', preserveNullAndEmptyArrays: true } },

            // Lookup product details for each productId
            {
                $lookup: {
                    from: 'products',
                    let: { productId: '$products.productId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$productId'] } } },
                        { $project: { title: 1, thumbnailImg: 1 } }
                    ],
                    as: 'productDetails'
                }
            },
            { $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } },

            // Add product details into products.productId
            {
                $addFields: {
                    'products.productId': {
                        _id: '$productDetails._id',
                        title: '$productDetails.title',
                        thumbnail: '$productDetails.thumbnailImg'
                    }
                }
            },

            // Group back by order _id and push all products into an array
            {
                $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    shippingAddress: { $first: '$shippingAddress' },
                    totalAmount: { $first: '$totalAmount' },
                    discount: { $first: '$discount' },
                    tax: { $first: '$tax' },
                    finalAmount: { $first: '$finalAmount' },
                    currency: { $first: '$currency' },
                    orderStatus: { $first: '$orderStatus' },
                    orderNumber: { $first: '$orderNumber' },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' },
                    products: { $push: '$products' }
                }
            },
            {
                $lookup: {
                    from: 'transactions',
                    localField: '_id',        // order _id
                    foreignField: 'orderId',  // in transactions
                    as: 'transactions'
                }
            },
             { $unwind: { path: '$transactions', preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    _id: 1,
                    userId: 1,
                    // shippingAddress: 1,
                    totalAmount: 1,
                    // discount: 1,
                    // tax: 1,
                    // finalAmount: 1,
                    // currency: 1,
                    orderStatus: 1,
                    orderNumber: 1,
                    createdAt: 1,
                    // updatedAt: 1,
                    products: {
                        _id: 1,
                        productId: 1,
                        size: 1,
                        quantity: 1,
                        originalPrice: 1,
                        discountedPrice: 1,
                        // status: 1,
                        // cancelledAt: 1
                    },
                    transactions: {
                        transactionType: 1,
                        orderId:1,
                        method: 1,
                        gateway: 1,
                        transactionId: 1,
                        amount: 1,
                        currency: 1,
                        status: 1,
                        createdAt: 1,
                        updatedAt:1
                    }
                }
            }
        ]);

        return res.status(200).json(orderData);
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}


module.exports = getOrdersByUserId