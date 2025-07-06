import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/orders/OrderCard';
import { formatToRelativeDate, isWithinCalendarDays } from '../utils/dateFormatter';
import { productStatusBeforeStyles, productStatusBgStyles, productStatusStyles } from '../constants/styleMaps';
import { orderStatusValues } from '../constants/valueMaps';
import { Info } from 'lucide-react';
import BackButton from '../components/bag/BackButton';
import OrderStatusTimeline from '../components/orders/OrderStatusTimeline';

const orderSample = {
  "_id": "order123",
  "orderNumber": "ORD12345",
  "createdAt": "2025-05-28T12:00:00Z",
  "orderStatus": "delivered",
  "deliveredAt": "2025-06-05T12:00:00Z",
  "shippingAddress": {
    "fullName": "John Doe",
    "line1": "123 Street",
    "landmark": 'Greenland school',
    "city": "Bandra",
    "state": "Mumbai",
    "pincode": "400001",
    "country": "India"
  },
  "products": [
    {
      "_id": "prodItem1",
      "productId": {
        "title":
          "Blue Tee",
        "thumbnail": "https://picsum.photos/seed/prod1-90/500/800",
        "description": "..."
      },
      "size": "M",
      "quantity": 1,
      "discountedPrice": 999,
      "originalPrice": 1499,
      "status": "delivered",
      "isReturned": true,
      "returnInfo": { "status": "refunded", "refundedAt": "2025-05-30" },
      "isExchangeItem": false,
      "exchangedFrom": null
    },
    {
      "_id": "prodItem2",
      "productId": {
        "title":
          "Black Oversized Tee",
        "thumbnail": "https://picsum.photos/seed/prod1-70/500/800",
        "description": "..."
      },
      "size": "M",
      "quantity": 1,
      "discountedPrice": 999,
      "originalPrice": 1499,
      "status": "exchanged",
      "isExchangeItem": false,
      "exchangedFrom": null
    }
  ],
  "subtotal": 1499,
  "discount": 500,
  "tax": 99,
  "deliveryFee": 39,
  "totalAmount": 1098,
  paymentDetails: {
    method: "UPI",
    amount: 1098,
    status: "successfull",
    currency: "INR",
    gateway: "razorpay",
  }
}

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReturnInfo, setShowReturnInfo] = useState(false);

  useEffect(() => {
    // fetch(`/api/orders/₹{orderId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setOrder(data.order);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     console.error('Failed to fetch order details', err);
    //     setLoading(false);
    //   });
    setLoading(false)
    setOrder(orderSample)
  }, [orderId]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!order) return <div className="p-10 text-center">Order not found.</div>;

  const {
    orderNumber,
    createdAt,
    orderStatus,
    shippingAddress,
    products,
    discount,
    deliveryFee,
    subtotal,
    totalAmount,
    paymentDetails
  } = order;

  const isDelivered = orderStatus === 'delivered';
  const isPending = orderStatus === 'pending';
  const isCancelled = orderStatus === 'cancelled';
  const isReturned = orderStatus === 'returned';
  const isRefunded = orderStatus === 'refunded';
  const discountPercent = (discount / subtotal) * 100

  // can return within 3 calendar days from deliveredAt date 
  const isWithin3Days = isWithinCalendarDays(order?.deliveredAt, 3)
  const canReturnOrExchange = orderStatus === 'delivered' && isWithin3Days;

  const handleBack = () => {
    history.back()
  }

  const nearby = (landmark) => {
    if (!landmark) return ''

    let firstWord = landmark.split(' ')[0].toLowerCase();
    if (['near', 'nearby'].includes(firstWord)) {
      return landmark;
    }
    return `Near ${landmark}`;
  }

  return (
    <div className="p-4 py-20 md:p-8 md:py-24 border">
      <div className='flex gap-x-2 items-center mb-4'>
        <BackButton handleClick={handleBack} className='-mt-px' />
        <h1 className="text-xl text-dark font-semibold">
          Order details
        </h1>
      </div>

      <div className='text-dark flex flex-col flex-wrap slg:flex-row gap-8'>
        {/* orders section  */}
        <div className="flex-1 h-fit rounded-2xl border border-light/10 bg-light p-4 sm:p-6 flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="flex-1 space-y-6 sm:space-y-8">

            {/* Order Header with status + action */}
            <div className="space-y-2">
              <div className="flex items-center sm:justify-between gap-2">

                {/* Left: Order ID + Status */}
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-semibold">#{orderNumber}</h2>

                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${productStatusBgStyles[order.orderStatus]}`}>
                    <span className={`${productStatusBeforeStyles[order.orderStatus]} w-1.5 h-1.5 rounded-full`}></span>
                    <p className={productStatusStyles[order.orderStatus] || 'text-subtext'}>
                      {orderStatusValues[order.orderStatus]}
                    </p>
                  </div>
                </div>

                {/* Right: Return or Cancel Action */}
                <div className="relative ms-auto flex items-center">
                  {isDelivered ? (
                    canReturnOrExchange ? (
                      <button className="text-sm font-medium text-subtext underline hover:text-blue-400">
                        Return Order
                      </button>
                    ) : (
                      <>
                        {/* Desktop: show message inline */}
                        <span className="hidden sm:block text-sm italic text-subtext bg-accent px-3 py-1 rounded">
                          This order is no longer eligible for return.
                        </span>

                        {/* Mobile: show info icon that toggles message */}
                        <button
                          className="sm:hidden text-subtext hover:text-blue-400"
                          onClick={() => setShowReturnInfo(!showReturnInfo)}
                          aria-label="Show return info"
                        >
                          <Info size={18} />
                        </button>

                        {/* conditionally show Mobile return-expired notice */}
                        {showReturnInfo && (
                          <p className="absolute top-0 right-4 w-max z-20 sm:hidden mt-2 text-sm italic text-subtext bg-accent px-3 py-2 rounded shadow-lg">
                            This order is no longer eligible for return.
                          </p>
                        )}

                      </>
                    )
                  ) : isPending && (
                    <button className="text-sm font-medium text-subtext underline hover:text-blue-400">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Subtext: Date Info */}
              <p className="text-sm text-subtext">
                Placed on {formatToRelativeDate(createdAt)}{' '}
                {order?.deliveredAt && `| Delivered on ${formatToRelativeDate(order.deliveredAt)}`}
              </p>

            </div>

            {/* Timeline (with elegant margin spacing) */}
            <div className="pt-4 pb-6 border- border-light/10">
              <OrderStatusTimeline currentStatus={orderStatus} />
            </div>

            {/* Product List */}
            <div className="space-y-5 sm:space-y-6">
              {products.map((product, idx) => (
                <ProductCard
                  key={idx}
                  product={product}
                  orderStatus={orderStatus}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Summary + Address */}
        <div className='flex flex-col gap-8 w-full h-fit slg:w-1/3'>
          {/* Order Summary */}
          <section className="w-full h-fit sm:p-1 rounded-xl sm:border border-border text-dark shadow-2xl shadow-dark">
            <div className='bg-light p-6 rounded-lg border border-border'>
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <p className='px-3 py-0.5 mb-3 text-xs rounded border w-fit border-green-700'>{paymentDetails.method}</p>
              <div className="flex justify-between items-center mb-3">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center mb-3 text-red-500">
                <span>Discount ({discountPercent.toFixed(2)}%)</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg mt-4">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="w-full h-fit p-6 rounded-xl border border-border text-dark shadow-2xl shadow-dark">
            <h4 className="text-lg font-semibold mb-4">Shipping Address</h4>
            <ul className="text-sm text-subtext space-y-3">

              {/* Top Row: fullname */}
              <p className="font-semibold text-sm">
                {shippingAddress?.fullName}, {shippingAddress?.phone}
              </p>
              {/* middle Row: Address */}
              <p className="text-sm">
                {shippingAddress.line1}, {nearby(shippingAddress?.landmark)}
              </p>

              {/* Second Row: City/State/Pincode/Country */}
              <div className="text-sm text-subtext flex flex-wrap gap-x-2 gap-y-1">
                <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                <p className="bg-dark/10 text-subtext px-2 py-0.5 rounded">{shippingAddress.country}</p>
              </div>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}