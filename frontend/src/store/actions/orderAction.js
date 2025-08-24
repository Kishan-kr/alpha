import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosClient";
import { ORDERS_PAGE_LIMIT } from "../../constants/appConstants";

/**
 * GET /api/orders
 * { page: 1, limit: 10 }
 * Returns: { status, message, orders }
 */
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (
    { page = 1, limit = ORDERS_PAGE_LIMIT, status, type } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      if (type) params.type = type;

      const { data } = await api.get("/orders", { params });

      if (data?.status !== true) {
        throw new Error(data?.error || "Failed to fetch orders");
      }

      return {
        orders: Array.isArray(data.orders) ? data.orders : [],
        pagination: data.pagination || { page, limit, total: 0, totalPages: 1 },
      };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || err.message || "Failed to fetch orders"
      );
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


// Get stocks of a product by id
export const getStocksOfAnItems = createAsyncThunk(
  'orders/getStocksOfAnItem',
  async (productId, {rejectWithValue}) => {
    try {
      const res = await api.get(`/products/stocks/${productId}`);
      return res.data.product; // expected: product: { _id: "...", sizes: [ { size: "L", quantity: 6, }, { size: "XL", quantity: 5, } ] }

    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);