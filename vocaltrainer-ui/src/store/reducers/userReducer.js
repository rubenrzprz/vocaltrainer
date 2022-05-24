import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAxios from '../authAxios';

const initialState = {
    status: 'idle',
    data: {},
    error: null
}

/**
 * Fetches a user
 */
export const fetchUser = createAsyncThunk('user/fetchUser', async(userId) => {
    const { data } = await authAxios.get(`users/${userId}`);
    return data;
})

/**
 * User reducer
 */
export const userReducer = createSlice({
    name: 'user',
    initialState: initialState,
    extraReducers(builder) {
        builder
          .addCase(fetchUser.pending, (state, action) => {
            state.status = 'loading';
          })
          .addCase(fetchUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.data = action.payload;
          })
          .addCase(fetchUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
      }
})

export const selectUserData = state => state.user.userInfo.data;

export default userReducer.reducer;