import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import bagReducer from './slices/bagSlice';
import homeReducer from './slices/homeSlice';
import productsReducer from './slices/productSlice';
import productDetailReducer from './slices/productDetailSlice';
import ordersReducer from './slices/orderSlice';
import { loadFromLocalStorage } from '../utils/manageLocalStorageBag';

const preloadedState = {
  bag: loadFromLocalStorage(),
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    bag: bagReducer,
    home: homeReducer,
    products: productsReducer,
    productDetail: productDetailReducer,
    orders: ordersReducer,
  },
  preloadedState
});

export default store;