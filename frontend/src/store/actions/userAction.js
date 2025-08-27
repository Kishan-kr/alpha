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

// Get user data
export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {

      const res = await axios.get(`${BASE_URL}/me`, {...getAuthHeaders(), withCredentials: true});
      return res.data?.user || {};
    } catch (err) {
      if (err.response?.status === 401) {
        // Not logged in: return a special value or just reject silently
        return rejectWithValue('NOT_LOGGED_IN');
      }
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/logout`, {}, {withCredentials: true});
      return res.data || {};
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);


// update user [first name and last name]
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ firstName, lastName }, { rejectWithValue }) => {
    try {

      const res = await axios.patch(
        `${BASE_URL}/me`,
        { firstName, lastName },
        { ...getAuthHeaders(), withCredentials: true }
      );

      return res.data?.user || {};
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// send OTP on Email
export const sendOtpOnEmail = createAsyncThunk(
  'user/sendOtpOnEmail',
  async (email, { rejectWithValue }) => {
    try {

      const res = await axios.post(
        `${BASE_URL}/me/email/send-otp`,
        { email },
        { ...getAuthHeaders(), withCredentials: true }
      );

      return res.data || {};
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// verify OTP sent over Email
export const verifyEmailOtp = createAsyncThunk(
  'user/verifyEmailOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {

      const res = await axios.post(
        `${BASE_URL}/me/email/validate-otp`,
        { email, otp },
        { ...getAuthHeaders(), withCredentials: true }
      );

      return res.data?.user?.email || '';
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// update all addresses at once
export const updateAllAddresses = createAsyncThunk(
  'user/updateAllAddresses',
  async (addresses, { rejectWithValue }) => {
    const reqBody = addresses;
    try {
      const res = await axios.patch(
        `${BASE_URL}/me/addresses`,
        reqBody, // expecting [ {addr1}, {addr2}, ... ]  in body
        { ...getAuthHeaders(), withCredentials: true }
      );

      return res.data?.addresses || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);