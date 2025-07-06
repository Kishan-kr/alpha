import { createSlice } from '@reduxjs/toolkit';

// dummy data of user 
const initialState = {
  isLoggedIn: true,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '9876543210',
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
      addressLine: 'WZ-456, Sector 1',
      landmark: 'Rajendra Place',
      city: 'North Delhi',
      state: 'Delhi',
      pincode: '110008',
      country: 'India',
      isDefault: false
    },
  ],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleLogin: (state) => { state.isLoggedIn = !state.isLoggedIn; },
  },
});

export const { toggleLogin } = userSlice.actions;
export default userSlice.reducer;