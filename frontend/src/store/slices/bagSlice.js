// bagSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { addItemToBagThunk, fetchUserBagThunk, removeItemFromBagThunk } from '../actions/bagAction';
import { saveToLocalStorage } from '../../utils/manageLocalStorageBag';

const initialState = {
  items: [],  // Array of items: { productId, _id, title, price, quantity, ... }
  status: 'idle', // 'loading' | 'succeeded' | 'failed'
  error: null,
};

const bagSlice = createSlice({
  name: 'bag',
  initialState,
  reducers: {
    addToBag: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(i =>
        i.productId === item.productId &&
        i.size === item.size &&
        i.color === item.color
      );

      if (existingItem) {
        return;
      }
      state.items.push({ ...item, quantity: item.quantity || 1 });
      saveToLocalStorage(state);
    },
    
    removeFromBag: (state, action) => {
      const { productId, size, color } = action.payload;
      state.items = state.items.filter(i =>
        !(i.productId === productId && i.size === size && i.color === color)
      );
      saveToLocalStorage(state);
    },
    
    updateQuantity: (state, action) => {
      const { productId, size, color, quantity } = action.payload;
      const item = state.items.find(i =>
        i.productId === productId &&
        i.size === size &&
        i.color === color
      );
      if (item && quantity > 0) {
        item.quantity = quantity;
        saveToLocalStorage(state);
      }
    },
    
    clearBag: (state) => {
      state.items = [];
      saveToLocalStorage(state);
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(addItemToBagThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addItemToBagThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(addItemToBagThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });


    builder
      .addCase(removeItemFromBagThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeItemFromBagThunk.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(removeItemFromBagThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });


    builder
      .addCase(fetchUserBagThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserBagThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.error = null;
        saveToLocalStorage(state)
      })
      .addCase(fetchUserBagThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { addToBag, removeFromBag, updateQuantity, clearBag } = bagSlice.actions;
export default bagSlice.reducer;