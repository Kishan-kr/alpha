import { createSlice } from "@reduxjs/toolkit";
import {
  fetchOrders,
  fetchOrderById,
  cancelOrder,
  requestWholeReturn,
  requestItemReturn,
  requestItemExchange,
} from "../actions/orderAction";

// add once at top
const toPlain = (x) => {
  try { return JSON.parse(JSON.stringify(x)); } catch { return x; }
};

const initialState = {
  list: [],
  listLoading: false,
  listError: null,

  current: null,
  currentLoading: false,
  currentError: null,

  actionLoading: false,
  actionError: null,
  lastAction: null, // "cancel" | "return_whole" | "return_item" | "exchange_item"
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderErrors(state) {
      state.listError = null;
      state.currentError = null;
      state.actionError = null;
    },
    resetLastAction(state) {
      state.lastAction = null;
    },
  },
  extraReducers: (builder) => {
    // ===== List =====
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.listLoading = false;
        // state.list = action.payload || [];
        state.list = Array.isArray(action.payload)
          ? action.payload.map(toPlain)  // clone
          : [];
          console.log('fullfilled orders: ', action.payload)//test
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload || "Failed to fetch orders";
      });

    // ===== Detail =====
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.currentLoading = true;
        state.currentError = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        console.log('fullfilled...', action.payload)//test
        state.currentLoading = false;
        // state.current = action.payload || null;
        state.current = toPlain(action.payload || null); // clone
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        console.log('rejected...', action.payload)//test
        state.currentLoading = false;
        state.currentError = action.payload || "Failed to fetch order";
      });

    // ===== Actions (cancel / return / exchange) =====
    const start = (state) => {
      state.actionLoading = true;
      state.actionError = null;
    };
    const fail = (state, action) => {
      state.actionLoading = false;
      state.actionError = action.payload || "Action failed";
    };

    // Cancel whole order
    builder
      .addCase(cancelOrder.pending, start)
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.lastAction = "cancel";

        // Update current if it matches
        const updated = action.payload?.order;
        if (updated && state.current && state.current._id === updated._id) {
          state.current = updated;
        }
        // Update list if present
        if (updated && Array.isArray(state.list) && state.list.length) {
          const idx = state.list.findIndex((o) => o._id === updated._id);
          if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
        }
      })
      .addCase(cancelOrder.rejected, fail);

    // Whole order return
    builder
      .addCase(requestWholeReturn.pending, start)
      .addCase(requestWholeReturn.fulfilled, (state) => {
        state.actionLoading = false;
        state.lastAction = "return_whole";
      })
      .addCase(requestWholeReturn.rejected, fail);

    // Item return
    builder
      .addCase(requestItemReturn.pending, start)
      .addCase(requestItemReturn.fulfilled, (state) => {
        state.actionLoading = false;
        state.lastAction = "return_item";
      })
      .addCase(requestItemReturn.rejected, fail);

    // Item exchange
    builder
      .addCase(requestItemExchange.pending, start)
      .addCase(requestItemExchange.fulfilled, (state) => {
        state.actionLoading = false;
        state.lastAction = "exchange_item";
      })
      .addCase(requestItemExchange.rejected, fail);
  },
});

export const { clearOrderErrors, resetLastAction } = orderSlice.actions;
export default orderSlice.reducer;

// ===== Selectors =====
export const selectOrders = (s) => s.orders.list;
export const selectOrdersLoading = (s) => s.orders.listLoading;
export const selectOrder = (s) => s.orders.current;
export const selectOrderLoading = (s) => s.orders.currentLoading;
export const selectOrderActionLoading = (s) => s.orders.actionLoading;
export const selectOrderErrors = (s) => ({
  listError: s.orders.listError,
  currentError: s.orders.currentError,
  actionError: s.orders.actionError,
});
export const selectLastOrderAction = (s) => s.orders.lastAction;