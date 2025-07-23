import { createSlice } from "@reduxjs/toolkit";
import { fetchProductDetail } from "../actions/productAction";

const initialState = {
  product: {},       // full product detail
  status: 'idle',      // 'loading' | 'succeeded' | 'failed'
  error: null
};

const productDetailSlice = createSlice({
  name: 'productDetail',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.product = action.payload
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export default productDetailSlice.reducer;