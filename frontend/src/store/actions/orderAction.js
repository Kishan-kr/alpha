import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosClient";

const USE_MOCK = true; //test
/**
 * GET /api/orders
 * Returns: { status, message, orders }
 */
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      // const { data } = await api.get("/orders");
      const res = await fetch("/mock/orders.json"); //test
      let data = await res.json(); // test
      data.status = true; // test
      data.orders = data; // test
      if (data?.status !== true) throw new Error(data?.error || "Failed to fetch orders");
      return data.orders || [];
    } catch (err) {
      return rejectWithValue(err.normalizedMessage || err.message);
    }
  }
);

/**
 * GET /api/orders/:orderId
 * Returns: { status, message, order }
 */
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      // DEV: point to the mock file
      if (USE_MOCK) {
        // IMPORTANT: orderId must match the file name you saved
        const { data } = await api.get(`/mock/order-${orderId}.json`, { baseURL: "" });
        // mock returns the order object directly
        // throw new Error('File not found')
        return data;
      }
      const { data } = await api.get(`/orders/${orderId}`);
      if (data?.status !== true) throw new Error(data?.error || "Failed to fetch order");
      return data.order;
    } catch (err) {
      console.log('error at fetch: ', err) //test
      return rejectWithValue(err.normalizedMessage || err.message);
    }
  }
);

/**
 * POST /api/orders/:orderId/cancel
 * Returns: { status, message, order }
 */
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/orders/${orderId}/cancel`);
      if (data?.status !== true) throw new Error(data?.error || "Failed to cancel order");
      return { orderId, order: data.order };
    } catch (err) {
      return rejectWithValue(err.normalizedMessage || err.message);
    }
  }
);

/**
 * POST /api/orders/:orderId/return (whole order)
 * Body: { reason }
 * Returns: { status, message, rma }
 */
export const requestWholeReturn = createAsyncThunk(
  "orders/requestWholeReturn",
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/orders/${orderId}/return`, { reason });
      if (data?.status !== true) throw new Error(data?.error || "Failed to request return");
      return { orderId, rma: data.rma };
    } catch (err) {
      return rejectWithValue(err.normalizedMessage || err.message);
    }
  }
);

/**
 * POST /api/orders/:orderId/items/:itemId/return
 * Body: { reason }
 * Returns: { status, message, rma }
 */
export const requestItemReturn = createAsyncThunk(
  "orders/requestItemReturn",
  async ({ orderId, itemId, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/orders/${orderId}/items/${itemId}/return`, { reason });
      if (data?.status !== true) throw new Error(data?.error || "Failed to request item return");
      return { orderId, itemId, rma: data.rma };
    } catch (err) {
      return rejectWithValue(err.normalizedMessage || err.message);
    }
  }
);

/**
 * POST /api/orders/:orderId/items/:itemId/exchange
 * Body: { reason, newSize, newColor, newSku }
 * Returns: { status, message, rma }
 */
export const requestItemExchange = createAsyncThunk(
  "orders/requestItemExchange",
  async ({ orderId, itemId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/orders/${orderId}/items/${itemId}/exchange`, payload);
      if (data?.status !== true) throw new Error(data?.error || "Failed to request exchange");
      return { orderId, itemId, rma: data.rma };
    } catch (err) {
      return rejectWithValue(err.normalizedMessage || err.message);
    }
  }
);