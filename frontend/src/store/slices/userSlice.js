import { createSlice } from '@reduxjs/toolkit';

// dummy data of user 
const initialState = {
  isLoggedIn: true,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+91 9876543210',
  addresses: [
    {
      id: 1,
      addressLine: '123 MG Road',
      landmark: 'Near Gandhi Maidan',
      city: 'North Delhi',
      state: 'Delhi',
      pincode: '110006',
      country: 'India',
      isDefault: true
    },
    {
      id: 2,
      addressLine: '123 MG Road',
      landmark: 'Gandhi Maidan',
      city: 'North Delhi',
      state: 'Delhi',
      pincode: '110006',
      country: 'India',
      isDefault: false
    },
  ],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
  },
});

export const { increment, decrement } = userSlice.actions;
export default userSlice.reducer;