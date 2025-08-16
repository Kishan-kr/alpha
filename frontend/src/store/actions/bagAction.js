import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import getAuthHeaders from '../../utils/authHeaderHelper';

// Global API base
const BASE_URL = `${import.meta.env.VITE_API_URL}/carts`;

// Add to bag
export const addItemToBagThunk = createAsyncThunk(
  'bag/addItem',
  async (item, {rejectWithValue}) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/${item.productId}`,
        {
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        },
        { ...getAuthHeaders(), withCredentials: true }
      );
      return res.data.cartItems;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Update item quantity
export const updateBagItemThunk = createAsyncThunk(
  'bag/updateItem',
  async ({ _id, size, quantity }, {rejectWithValue}) => {
    try {
      await axios.patch(
        `${BASE_URL}/${_id}`,
        { size, quantity },
        { ...getAuthHeaders(), withCredentials: true }
      );
      return { _id, size, quantity };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Remove item from bag
export const removeItemFromBagThunk = createAsyncThunk(
  'bag/removeItem',
  async (_id, {rejectWithValue}) => {
    try {
      await axios.delete(`${BASE_URL}/${_id}`, { ...getAuthHeaders(), withCredentials: true });
      return _id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Clear all items from bag
export const clearUserBagThunk = createAsyncThunk(
  'bag/clearBag',
  async (_, {rejectWithValue}) => {
    try {
      await axios.delete(BASE_URL, { ...getAuthHeaders(), withCredentials: true });
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Fetch all items in user's cart (optional)
export const fetchUserBagThunk = createAsyncThunk(
  'bag/fetchItems',
  async (_, {rejectWithValue}) => {
    try {
      const res = await axios.get(BASE_URL, { ...getAuthHeaders(), withCredentials: true });
      return res.data?.cartItems || []; // expected: array of items
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Get stocks of all cart items in user's cart
export const getStocksOfCartItems = createAsyncThunk(
  'bag/getStocksOfCartItems',
  async (products, {rejectWithValue}) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/products/stocks`,
        {products}, 
        { ...getAuthHeaders(), withCredentials: true }
      );
      return res.data.stocks; // expected: "stocks": { "6849e_XL_navy": { "maxStock": 5}, ...}
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);