import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAxios from '../authAxios';

const initialState = {
  status: 'idle',
  data: {},
  error: null
}

/**
 * Fetches a profile
 */
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (userId) => {
  const { data } = await authAxios.get(`profiles/${userId}`);
  return data;
})

/**
 * Updates a profile
 */
export const updateProfile = createAsyncThunk('profile/updateProfile', async ({profile, userId}, {rejectWithValue}) => {
  try {
    await authAxios.put(
      `profiles/${userId}`,
      profile
    );
    return profile;
  } catch (error) {
    return rejectWithValue(error.response.message);
  }
})

/**
 * Profile reducer
 */
export const profileReducer = createSlice({
  name: 'profile',
  initialState: initialState,
  reducers: {
    resetProfile(state, action) {
      state = {...initialState};
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProfile.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
  }
})

export const selectProfileData = state => state.user.profile.data;

export const { resetProfile } = profileReducer.actions;

export default profileReducer.reducer;