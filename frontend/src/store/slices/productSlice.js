import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "../actions/productAction";

const initialState = {
  items: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 0,
  status: 'idle', // 'loading' | 'succeeded' | 'failed'
  error: null
}

const productSlice = createSlice({
  name: 'product',
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        Object.assign(state, {
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages,
          totalCount: payload.totalCount,
          items: payload.productsList,
          status: 'succeeded',
          error: null,
        });
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
})

// export const {} = productSlice.actions;
export default productSlice.reducer;