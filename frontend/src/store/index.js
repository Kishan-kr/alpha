import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import bagReducer from './slices/bagSlice';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/manageLocalStorageBag';

const preloadedState = {
  bag: loadFromLocalStorage(),
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    bag: bagReducer,
  },
  preloadedState
});

export default store;