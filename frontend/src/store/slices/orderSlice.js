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

  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  },

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
    // Pagination controls (dispatch then call fetchOrders with new page/limit)
    setOrdersPage(state, action) {
      const p = Number(action.payload) || 1;
      state.pagination.page = Math.max(1, p);
    },
    setOrdersLimit(state, action) {
      const l = Number(action.payload) || 5;
      state.pagination.limit = Math.max(1, l);
      state.pagination.page = 1; // reset to first page on limit change
    },
    goPrevOrdersPage(state) {
      state.pagination.page = Math.max(1, state.pagination.page - 1);
    },
    goNextOrdersPage(state) {
      const { page, totalPages } = state.pagination;
      state.pagination.page = Math.min(totalPages || 1, page + 1);
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

        const payload = action.payload || {};
        const arr = Array.isArray(payload.orders) ? payload.orders : [];
        state.list = arr.map(toPlain);

        const p = payload.pagination || {};
        state.pagination = {
          page: Number(p.page) || state.pagination.page || 1,
          limit: Number(p.limit) || state.pagination.limit || 5,
          total: Number(p.total) || 0,
          totalPages:
            Number(p.totalPages) ||
            (p.total && p.limit ? Math.max(Math.ceil(p.total / p.limit), 1) : state.pagination.totalPages || 1),
        };
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
        state.currentLoading = false;
        // state.current = action.payload || null;
        state.current = toPlain(action.payload || null); // clone
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.currentLoading = false;
        state.currentError = action.payload || "Failed to fetch order";
      });

    // ===== Actions (cancel / return / exchange) =====
    const start = (state) => {
      state.actionLoading = true;
      state.actionError = null;
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
      .addCase(cancelOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || "Failed to cancel order";
      })

    // Whole order return [ NOT IN USE ]
    builder
      .addCase(requestWholeReturn.pending, start)
      .addCase(requestWholeReturn.fulfilled, (state) => {
        state.actionLoading = false;
        state.lastAction = "return_whole";
      })
      .addCase(requestWholeReturn.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || "Failed to request return";
      });

    // Item return
    builder
      .addCase(requestItemReturn.pending, start)
      .addCase(requestItemReturn.fulfilled, (state) => {
        state.actionLoading = false;
        state.lastAction = "return_item";
      })
      .addCase(requestItemReturn.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || "Failed to request return";
      });

    // Item exchange
    builder
      .addCase(requestItemExchange.pending, start)
      .addCase(requestItemExchange.fulfilled, (state) => {
        state.actionLoading = false;
        state.lastAction = "exchange_item";
      })
      .addCase(requestItemExchange.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || "Failed to request exchange";
      });
  },
});

export const {
  clearOrderErrors,
  resetLastAction,
  setOrdersPage,
  setOrdersLimit,
  goPrevOrdersPage,
  goNextOrdersPage,
} = orderSlice.actions;
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