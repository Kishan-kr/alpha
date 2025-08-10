import axios from "axios";
import getAuthHeaders from "../../utils/authHeaderHelper";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Global API base
const BASE_URL = `${import.meta.env.VITE_API_URL}/users`;

// Send otp over phone
export const sendOtpOnPhone = createAsyncThunk(
  'user/sendOtpOnPhone',
  async (phone, { rejectWithValue }) => {
    try {

      const res = await axios.post(`${BASE_URL}/auth/send-otp`, { phone }, getAuthHeaders());
      return res.data || {};
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// verify SMS OTP
export const verifySmsOtp = createAsyncThunk(
  'user/verifySmsOtp',
  async ({ phone, otp, firstName, lastName }, { rejectWithValue }) => {
    try {

      const res = await axios.post(
        `${BASE_URL}/auth/validate-otp`,
        { phone, otp, firstName, lastName },
        { ...getAuthHeaders(), withCredentials: true }
      );

      return res.data?.user || {};
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);