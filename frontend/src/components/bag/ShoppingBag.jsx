import React, { useEffect } from 'react';
import BagProductCard from './BagProductCard';
import EmptyBag from './EmptyBag';
import { useDispatch, useSelector } from 'react-redux';
import { removeBagItemAndSync, updateBagItemQuantityAndSync } from '../../utils/bagSync';
import { getStocksOfCartItems } from '../../store/actions/bagAction';
import { showErrorToastWithIcon } from '../../utils/customToasts';
import {
  MAX_ALLOWED_QUANTITY_PER_ITEM,
  MAX_ALLOWED_QUANTITY_REACH_MSG,
  STOCK_LIMIT_REACH_MSG
} from '../../constants/appConstants';
import CheckoutButton from './FastrrCheckoutButton';

const ShoppingBag = ({ products, subtotal, discount, discountPercent, delivery, total, handleCheckout }) => {

  const { isLoggedIn } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if(products?.length > 0) {
      dispatch(getStocksOfCartItems(products))
    }
  }, []);


  const handleDelete = (item) => {
    const itemData = {
      variantId: item.variantId,
      _id: item?._id,
      title: item.title,
      size: item.size,
    }
    removeBagItemAndSync(itemData, dispatch, isLoggedIn);
  };

  const handleIncrease = async (item) => {
    let { maxStock, quantity } = item;

    if (quantity >= maxStock) {
      showErrorToastWithIcon(STOCK_LIMIT_REACH_MSG)
      return;
    }

    if (quantity >= MAX_ALLOWED_QUANTITY_PER_ITEM) {
      showErrorToastWithIcon(MAX_ALLOWED_QUANTITY_REACH_MSG)
      return;
    }

    const itemData = {
      variantId: item.variantId,
      _id: item?._id,
      quantity: item.quantity + 1
    }

    updateBagItemQuantityAndSync(itemData, dispatch, isLoggedIn);
  };

  const handleDecrease = (item) => {
    const itemData = {
      variantId: item.variantId,
      _id: item?._id,
      quantity: item.quantity > 1 ? item.quantity - 1 : 1
    }

    updateBagItemQuantityAndSync(itemData, dispatch, isLoggedIn);
  };


  return (
    <div className='relative flex flex-col slg:flex-row gap-6 md:gap-20'>
      {/* main bag layout  */}
      <section className='flex-1'>

        {/* <button className='absolute -top-[31px] right-0 uppercase text-subtext underline text-xxs hover:text-dark'>Clear Bag</button> */}

        <div className=" bg-light space-y-7 md:space-y-16">

          {products.length ? products.map((product, idx) => (
            <BagProductCard
              key={product.productId + idx}
              product={product}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleDelete}
            />


          )) : <EmptyBag />}

        </div>
      </section>

      {/* right checkout section  */}
      {products.length > 0 && <section className="hidden slg:block bg-light w-full h-fit slg:w-[36%]  text-dark  slg:sticky slg:top-24 border border-hover-tint">
        <div className='p-6 uppercase font-light'>
          <h3 className="text-base text-dark">Order Summary</h3>
          <div className="text-subtext text-xs flex justify-between items-center mt-9">
            <span>Subtotal</span>
            <span>₹ {subtotal}</span>
          </div>
          <div className="text-subtext text-xs flex justify-between items-center mt-4">
            <span>Discount ({discountPercent}%)</span>
            <span>-₹ {discount.toFixed(2)}</span>
          </div>
          <div className="text-subtext text-xs flex justify-between items-center mt-4">
            <span>Delivery Fee</span>
            {delivery > 0 ? (
              <span>₹ {delivery}</span>
            ) : (
              <span className="text-green-600 font-light">Free</span>
            )}
          </div>
          <div className="text-dark text-base flex justify-between items-center mt-5">
            <span>Total</span>
            <span>₹ {total.toFixed(2)}</span>
          </div>
          {/* <button onClick={handleCheckout} className="text-sm mt-9 uppercase w-full justify-center items-center px-6 py-2 bg-dark text-light cursor-pointer">
            Checkout
          </button> */}
          <CheckoutButton />
        </div>

      </section>}

      {products.length > 0 && <div className='bg-light grid grid-cols-2 gap-x-3 py-4.5 items-center sticky bottom-0 slg:hidden font-light'>
        <div className="">
          <p className='uppercase text-xs'>Total</p>
          <p className='text-base mt-1'>₹ {total.toFixed(2)}</p>
          <small className='text-subtext block text-xxs mt-0'>Including GST</small>
        </div>
        <button onClick={handleCheckout} className="w-full h-fit flex justify-center items-center uppercase px-6 py-3 bg-dark text-sm text-light font-light cursor-pointer">
          Checkout
        </button>
      </div>}
    </div>
  );
};

export default ShoppingBag;