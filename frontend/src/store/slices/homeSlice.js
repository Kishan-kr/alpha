// bagSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchHomeReviews, fetchLookbookVideos, fetchNewArrivals } from '../actions/homeAction';
import reviews from '../../temp/reviews'
import lookbookVideos from '../../temp/lookbookData'

const initialState = {
  newArrivals: {
    items: [],
    status: 'idle', // 'loading' | 'succeeded' | 'failed'
    error: null
  },
  lookbookVideos: {
    items: lookbookVideos,
    status: 'idle', // 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reviews: {
    items: reviews,
    status: 'idle', // 'loading' | 'succeeded' | 'failed'
    error: null
  }
};

const homeSlice = createSlice({
  name: 'home',
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeReviews.pending, (state) => {
        state.reviews.status = 'loading';
      })
      .addCase(fetchHomeReviews.fulfilled, (state, action) => {
        state.reviews.items = action.payload;
        state.reviews.status = 'succeeded';
        state.reviews.error = null; 
      })
      .addCase(fetchHomeReviews.rejected, (state, action) => {
        state.reviews.status = 'failed';
        state.reviews.error = action.payload;
      });


    builder
      .addCase(fetchLookbookVideos.pending, (state) => {
        state.lookbookVideos.status = 'loading';
      })
      .addCase(fetchLookbookVideos.fulfilled, (state, action) => {
        state.lookbookVideos.status = 'succeeded';
        state.lookbookVideos.error = null;
        if (action.payload?.length > 0 ) {
          state.lookbookVideos.items = action.payload;
        }
      })
      .addCase(fetchLookbookVideos.rejected, (state, action) => {
        state.lookbookVideos.status = 'failed';
        state.lookbookVideos.error = action.payload;
      });


    builder
      .addCase(fetchNewArrivals.pending, (state) => {
        state.newArrivals.status = 'loading';
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals.items = action.payload;
        state.newArrivals.status = 'succeeded';
        state.newArrivals.error = null;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.newArrivals.status = 'failed';
        state.newArrivals.error = action.payload;
      });
  }
});

export const { addToBag, removeFromBag, updateQuantity, clearBag } = homeSlice.actions;
export default homeSlice.reducer;