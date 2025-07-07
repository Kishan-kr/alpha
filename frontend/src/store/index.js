import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import bagReducer from './slices/bagSlice';
import homeReducer from './slices/homeSlice';
import { loadFromLocalStorage } from '../utils/manageLocalStorageBag';

const preloadedState = {
  bag: loadFromLocalStorage(),
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    bag: bagReducer,
    home: homeReducer,
  },
  preloadedState
});

export default store;