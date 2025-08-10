import { createSlice } from '@reduxjs/toolkit';
import { sendOtpOnPhone, verifySmsOtp } from '../actions/userAction';
import { FAILED, LOADING, SUCCEEDED } from '../../constants/appConstants';

// dummy data of user 
const initialState = {
  isLoggedIn: false,
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
  searchQuery: '',
  phoneStatus: 'idle', // 'loading' | 'succeeded' | 'failed'
  verifyStatus: 'idle', // 'loading' | 'succeeded' | 'failed'
  verifyError: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
    toggleLogin: (state) => { state.isLoggedIn = !state.isLoggedIn; },
  },

  extraReducers: (builder) => {
    builder.addCase(sendOtpOnPhone.pending, (state) => {
      state.phoneStatus = LOADING;
    })
      .addCase(sendOtpOnPhone.fulfilled, (state) => {
        state.phoneStatus = SUCCEEDED;
      })
      .addCase(sendOtpOnPhone.rejected, (state, action) => {
        state.phoneStatus = FAILED;
      })


    builder.addCase(verifySmsOtp.pending, (state) => {
      state.verifyStatus = LOADING;
    })
      .addCase(verifySmsOtp.fulfilled, (state, action) => {
        const user = action.payload;

        if (user.firstName) state.firstName = user.firstName;
        if (user.lastName) state.lastName = user.lastName;
        if (user.email) state.email = user.email;
        if (user.phone) state.phone = user.phone;
        if (Array.isArray(user.addresses)) state.addresses = user.addresses;

        // Mark user as logged in after successful OTP verification
        state.isLoggedIn = true;

        state.verifyStatus = SUCCEEDED;
        state.verifyError = null
      })
      .addCase(verifySmsOtp.rejected, (state, action) => {
        state.verifyStatus = FAILED;
        state.verifyError = action.payload;
      })
  }
});

export const { toggleLogin, setSearchQuery } = userSlice.actions;
export default userSlice.reducer;