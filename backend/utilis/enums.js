const orderStatuses = [
  "pending", 
  "shipped", 
  "delivered",
  "cancelled"
]

const countries = [
  "India"
]

const currencies = [
  "INR"
]

const transactionTypes = [
  'payment',
  'refund'
]

const paymentMethods = [
  'card', 
  'upi', 
  'cod', 
  'wallet', 
  'netbanking'
]

const paymentGateways = [
  'razorpay', 
  'stripe', 
  'cashfree', 
  'paypal'
]

const paymentStatuses = [
  'successful', 
  'failed'
]

const returnStatuses = [
  'requested', 
  'approved', 
  'rejected', 
  'picked', 
  'received', 
  'refunded',
]

module.exports = {
  orderStatuses, 
  countries, 
  currencies, 
  transactionTypes,
  paymentMethods,
  paymentGateways,
  paymentStatuses,
  returnStatuses
};