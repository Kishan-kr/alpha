import { createAsyncThunk } from "@reduxjs/toolkit";
import getAuthHeaders from "../../utils/authHeaderHelper";
import axios from "axios";
import { NEW_ARRIVALS_COUNT } from "../../constants/appConstants";

// Global API base
const BASE_URL = `${import.meta.env.VITE_API_URL}`;

// Fetch all customer reviews to show on customer diaries section
export const fetchHomeReviews = createAsyncThunk(
  'home/getReviews',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/testimonials`, getAuthHeaders());
      return res.data?.testimonials || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch all new arrival products
export const fetchNewArrivals = createAsyncThunk(
  'home/getNewArrivals',
  async (_, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({
        limit: NEW_ARRIVALS_COUNT,
        sortBy: 'createdAt',
        order: 'desc',
      });
      
      const res = await axios.get(`${BASE_URL}/products/?${query}`, getAuthHeaders());
      return res.data?.productsList || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch all lookbook videos
export const fetchLookbookVideos = createAsyncThunk(
  'home/getLookbookVideos',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/lookbooks`, getAuthHeaders());
      return res.data?.videos || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);