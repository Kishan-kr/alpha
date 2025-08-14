import { createSlice } from '@reduxjs/toolkit';
import { getUser, sendOtpOnEmail, sendOtpOnPhone, updateAllAddresses, updateUser, verifyEmailOtp, verifySmsOtp } from '../actions/userAction';
import { FAILED, LOADING, SUCCEEDED } from '../../constants/appConstants';

// dummy data of user 
const initialState = {
  isLoggedIn: false,
  userInfo: null,
  searchQuery: '',
  phoneStatus: 'idle', // 'loading' | 'succeeded' | 'failed'
  verifyStatus: 'idle', // 'loading' | 'succeeded' | 'failed'
  status: 'idle', // 'loading' | 'succeeded' | 'failed'
  updateStatus: 'idle', // 'loading' | 'succeeded' | 'failed'
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
    toggleLogin: (state) => { state.isLoggedIn = !state.isLoggedIn; },
  },

  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.status = LOADING;
    })
      .addCase(getUser.fulfilled, (state, action) => {
        const user = action.payload;
        state.userInfo = user;
        state.isLoggedIn = true;
        state.status = SUCCEEDED;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        if (action.payload === 'NOT_LOGGED_IN') {
          state.isLoggedIn = false;
          state.userInfo = null;
        } else {
          state.status = FAILED;
          state.error = action.payload;
        }
      })


    builder.addCase(sendOtpOnPhone.pending, (state) => {
      state.phoneStatus = LOADING;
    })
      .addCase(sendOtpOnPhone.fulfilled, (state) => {
        state.phoneStatus = SUCCEEDED;
      })
      .addCase(sendOtpOnPhone.rejected, (state) => {
        state.phoneStatus = FAILED;
      })


    builder.addCase(verifySmsOtp.pending, (state) => {
      state.verifyStatus = LOADING;
    })
      .addCase(verifySmsOtp.fulfilled, (state, action) => {
        const user = action.payload;
        state.userInfo = user;
        state.isLoggedIn = true;
        state.verifyStatus = SUCCEEDED;
      })
      .addCase(verifySmsOtp.rejected, (state, action) => {
        state.verifyStatus = FAILED;
      })


    builder.addCase(updateUser.pending, (state) => {
      state.updateStatus = LOADING;
    })
      .addCase(updateUser.fulfilled, (state) => {
        state.updateStatus = SUCCEEDED;
      })
      .addCase(updateUser.rejected, (state) => {
        state.updateStatus = FAILED;
      })


    builder.addCase(sendOtpOnEmail.pending, (state) => {
      state.phoneStatus = LOADING;
    })
      .addCase(sendOtpOnEmail.fulfilled, (state) => {
        state.phoneStatus = SUCCEEDED;
      })
      .addCase(sendOtpOnEmail.rejected, (state) => {
        state.phoneStatus = FAILED;
      })


    builder.addCase(verifyEmailOtp.pending, (state) => {
      state.verifyStatus = LOADING;
    })
      .addCase(verifyEmailOtp.fulfilled, (state, action) => {
        state.userInfo.email = action.payload;
        state.verifyStatus = SUCCEEDED;
      })
      .addCase(verifyEmailOtp.rejected, (state) => {
        state.verifyStatus = FAILED;
      })


    builder.addCase(updateAllAddresses.pending, (state) => {
      state.updateStatus = LOADING;
    })
      .addCase(updateAllAddresses.fulfilled, (state, action) => {
        state.userInfo.addresses = action.payload;
        state.updateStatus = SUCCEEDED;
      })
      .addCase(updateAllAddresses.rejected, (state) => {
        state.updateStatus = FAILED;
      })
  }
});

export const { toggleLogin, setSearchQuery } = userSlice.actions;
export default userSlice.reducer;