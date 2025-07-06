import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Global API base
const BASE_URL = `${import.meta.env.VITE_API_URL}/carts`;

// Auth header helper
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

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
        getAuthHeaders()
      );
      return res.data.cartItems;
    } catch (err) {
      console.error("data: ", err.response?.data);
      console.error("message: ", err.message);
      return rejectWithValue(err.response?.data || err.message);
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
        getAuthHeaders()
      );
      return { _id, size, quantity };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Remove item from bag
export const removeItemFromBagThunk = createAsyncThunk(
  'bag/removeItem',
  async (_id, {rejectWithValue}) => {
    try {
      await axios.delete(`${BASE_URL}/${_id}`, getAuthHeaders());
      return _id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Clear all items from bag
export const clearUserBagThunk = createAsyncThunk(
  'bag/clearBag',
  async (_, {rejectWithValue}) => {
    try {
      await axios.delete(BASE_URL, getAuthHeaders());
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch all items in user's cart (optional)
export const fetchUserBagThunk = createAsyncThunk(
  'bag/fetchItems',
  async (_, {rejectWithValue}) => {
    try {
      const res = await axios.get(BASE_URL, getAuthHeaders());
      return res.data; // expected: array of items
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);