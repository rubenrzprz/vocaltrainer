import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import authAxios from '../authAxios';


const initialState = {
  status: 'idle',
  data: {
    "m-exercise": [],
    "b-exercise": [],
    "list": []
  },
  error: null
}

/**
 * Fetches the dashboard
 */
export const fetchDashboard = createAsyncThunk('dashboard/fetchDashboard', async (userId, { rejectWithValue }) => {
  try {
    const { data } = await authAxios.get(`publications/user/${userId}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.message);
  }
})

/**
 * Removes a publication
 */
export const removePublication = createAsyncThunk('dashboard/removePublication', async (publicationId, { rejectWithValue }) => {
  try {
    const { data } = await authAxios.delete(`publications/${publicationId}`)
    return {message: data, publicationId};
  } catch (error) {
    return rejectWithValue(error.response.message);
  }
})

/**
 * Saves a list
 */
export const saveList = createAsyncThunk('dashboard/saveList', async (publication, {rejectWithValue}) => {
  try {
      const { name, description } = publication;
      const { data } = await authAxios.post(
          'publications',
          {
              name,
              description,
              type: 'list'
          }
      )
      return data;
  } catch (error) {
      return rejectWithValue(error.response.data);
  }
})

/**
 * Gets a flat array of publications
 */
const getPublications = (state) => _.flatten(Object.values(state.data))
/**
 * Finds a publication in the dashboard
 */
const findInDashboard = (publicationId, state) => getPublications(state).find((publication) => publication.publicationId === publicationId)

/**
 * Dashboard reducer
 */
export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialState,
  reducers: {
    addToDashboard(state, action) {
      const { type } = action.payload;
      state.data[type].push(action.payload);
    },
    resetDashboard(state, action) {
      state = {...initialState};
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDashboard.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = Object.assign({ ...initialState.data }, _.groupBy(action.payload, ({ type }) => type))
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(removePublication.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(removePublication.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { message, publicationId} = action.payload;
        state.message = message;
        const { type } = findInDashboard(publicationId, state);
        state.data[type] = state.data[type].filter(element => element.publicationId !== publicationId);
      })
      .addCase(removePublication.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveList.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(saveList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.list.push(action.payload);
      })
      .addCase(saveList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  }
})

export const selectDashboardData = state => state.user.dashboard.data;

export const { addToDashboard, resetDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;