const mongoose = require('mongoose');
const Order = require('../../models/order');
const orderedProduct = require('../../models/orderedProduct');
const transactions = require('../../models/transaction');

const createOrder = async (req, res) => {
    let session
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        const {
            userId,
            shippingAddress,
            totalAmount,
            discount,
            tax,
            finalAmount,
            orderStatus,
            orderNumber,
            products,
            transaction
        } = req.body;
        //  console.log(orderNumber ,userId);

        // Step 1: Create the Order 
        const order = new Order({
            userId,
            shippingAddress,
            totalAmount,
            discount,
            tax,
            finalAmount,
            orderStatus,
            orderNumber
        });

       const orderId =  await order.save({ session });

        // Step 2: Create Ordered Products (bulk insert)
        const orderedProducts = await orderedProduct.insertMany(
            products.map(prod => ({
                ...prod,
                orderId: orderId._id
            })),
            { session }
        );

        // Step 3: Create Transaction 
        const transactionDoc = new transactions({
            ...transaction,
            orderId: orderId._id,
            userId
        });

        await transactionDoc.save({ session });

        // Step 4: Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: 'Order, Ordered Products, and Transaction created successfully.',
            order,
            orderedProducts
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Transaction error:', error);
        return res.status(500).json({
            message: 'Transaction failed.',
            error: error.message
        });
    }
}


module.exports = createOrder