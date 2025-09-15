### Need to add category ID (from mongoDB) manually in constant/category file [IMP] ###

### HOMEPAGE ###
  - Hero section `done`. Need to replace video
  - New Arrivals section `done`
  - product categories section `done`
  - search feature `done`

  - happy customers section `done`. Need to replace with real reviews data in temp/reviews and mongoDB as well

  - Lookbook section `done`. Need to replace video URLs in temp/lookbookData and mongoDB as well

### FOOTER ###
  - UI `done`. Need to add all pages 
  - setup newsletter left
  
### COLLECTIONS ###
  - collections page `done`

### SEARCH ###
  - search page `done`

### PRODUCT DETAILS ###
  - product details page `done`
  - fetching product by slug `done`
  - fetching more products excluding the current `done`
  - add to cart `done`
  - size chart `done`
  - need to update measurement guide image in size chart `IMP` 

### SHOPPING BAG ###
  - shopping bag page: done inc-dec and remove items from bag for all users `done`
  - shopping bag page: tested inc-dec and remove items from bag for public users only `done`
  - shopping bag page: tested inc-dec and remove items from bag for logged in users also
  - need to see the logic for dynamic delivery fee, currently it is static 0 [IMP]


- add loader and error element in new arrivals section
- add use of getBagProduct utility function in search products page, all products page, and new arrivals section

### USER ###
- add login and signup page frontend as well as backend
- created middleware to verify user but not tested yet
- fixed login and signup pages styling
- created logout route and controller but not used in frontend yet

### USER PROFILE ###
- created user profile page completely
- update name modal completed
- upate email modal completed
- upate email format in backend
- remove unnecessary fields from validate phone controller before sending to client
- replace 'OTP' with 'code' in validate email controller
- add new route and controller for updating all addresses at once
- fixed edit address page, added ensure default address middleware
- modified UserProfile to show full name and contact number values also
- need to wrap the profile page in a protected component [done]


some modification in the order management.
- If an order is requested for return or exchange, a new order will be generated.
- I have added order type so that whether its a return, exchange or new, order list page will show all orders
- added originalOrderId which will be exist in return or exchange order only.
- rma schema will keep the track of return or exchange reason related details.
- now return will also be on item-level not whole order like exchange. And the conditions are same i.e., within 3-days after delivered.
- cancellation will be on order-level as it was, and can be cancelled within 24-hrs of placedAt.
- on order placement, stocks will be reduced, on cancellation, restock, similarly for return and exchange also.

below are the modified schemas. After this I'll upload images of frontend layouts also for the same.
Give me the backend part including models, routes, controllers. Please use the code style that I am already using.


# order item schema:
productId
title
size
color
quantity
price
subtotal
status: [RETURN_REQUESTED | RETURN_REJECTED | EXCHANGE_REQUESTED | EXCHANGE_REJECTED | EXCHANGE_DELIVERED | RETURNED]

# payment schema
method: [COD | CARD | UPI | NETBANKING | WALLET]
status: ["PENDING" | "PAID" | "REFUND_PENDING","REFUNDED" | "PARTIALLY_REFUNDED" | FAILED | REFUND_FAILED]
amount
transactionId
currencies: [INR]
createdAt
updatedAt

# ShipmentSchema
carrier
trackingNumber
status
checkpoints[]
 - status
 - at
 - note

# Order schema
userId
orderNumber
originalOrderId: [ref of order._id]
rmaId: [ref of rma._id]
type: [NEW | RETURN | EXCHANGE]
items: [item schema]
totals
 - itemsTotal
 - shippingFee
 - discount
 - grandTotal

status: [PENDING | CONFIRMED | SHIPPED | OUT_FOR_DELIVERY | DELIVERED | CANCELLED | RETURN_REQUESTED| PICKED_UP | RECEIVED | RETURN_COMPLETED | RETURN_REJECTED | EXCHANGE_REJECTED | EXCHANGE_REQUESTED]
payment: paymentSchema
shipping: shippingSchema
address: addressSchema
placedAt
cancelledAt
deliveredAt


# Rma schema
type: [RETURN | EXCHANGE]
scope: [ORDER | ITEM]
orderId: [ref of order._id]
reason
status: [REQUESTED | APPROVED | REJECTED | CLOSED]
createdAt
updatedAt
notes


- show delivered on date also, if status is delivered and has deliveredAt date at the appropriate position
- now there will be no return hwole order button, there will be only cancel order button at order level. You may change its position if it doesn't fits here.
- It items, item color is missing. Also show only those individual items' status, who's status exists
- Don't show return or exchange button if the order isn't eligible for. In that case show a message at the order level that the return or exchange window has been closed for this order.
- if the order.type == 'RETURN' OR 'EXCHANGE', show a link to original order also.


# media optimization
- created new route and controller to store different variants of an image on R2.
- optimized all pages where product images are rendered, to render appropriate variant according to screen size and resolution.
- For thumbnails, it will always render the thumbnail version only irrespective of screen size


# ORDERS MANAGEMENT
- done with orders list page, models, routes and controllers [done]
- done with order details page, models, routes and controllers [done]
- added cancel, return, and exchange requests as well as routes and controllers [done]
- need to protect the orders routes in FE side [done]
- protect profile routes too [done]

- need to add shiprocket checkout or payment integration [IMP]

- If a guest user at bag page fills address and verifies otp, his bag items gets fetched from DB and bag state gets updated [done] [issue]
- fixed the above by removing isLoggedIn dependency state from effect


# SHIPROCKET INTEGRATION
- /api/products   to fetch all products
- /api/products?category=cat_id     fetch all products of a category(collection)
- /api/categories   to fetch all categories(collections)

Alternate catalog APIs for Fastrr
- /api/fastrr/products?limit=10&page=1    to fetch all products
- /api/fastrr/products?collection_id=abc123&limit=10&page=1   to fetch all products of a category(collection)
- /api/fastrr/collections?page=1&limit=10     to fetch all categories(collections)

- in index.html test css and js scripts are added, need to replace with production ones [IMP]