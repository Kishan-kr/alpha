import axios from "axios";
import getAuthHeaders from "../../utils/authHeaderHelper";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Global API base
const BASE_URL = `${import.meta.env.VITE_API_URL}/products`;

// Fetch all new arrival products
export const fetchProducts = createAsyncThunk(
  'product/getProducts',
  async (query, { rejectWithValue }) => {
    try {

      const res = await axios.get(`${BASE_URL}/?${query}`, getAuthHeaders());
      return res.data || {};
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);