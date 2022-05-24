import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { publicFetch } from '../../utils/fetch';

const user = JSON.parse(localStorage.getItem("user"));

/**
 * Checks if a user is authenticated
 */
const isAuthenticated = ({token, expiresAt}) => {
    if (!token || !expiresAt) {
        return false;
    }
    return new Date().getTime() / 1000 < expiresAt;
}

const initialState = user && isAuthenticated(user) ?
    { isLogged: true, user, error: null } :
    { isLogged: false, user: null, error: null };

/**
 * Logs the user into the app
 */
export const login = createAsyncThunk('auth/login', async(credentials, {rejectWithValue}) => {
    try {
        const { data } = await publicFetch.post(
            'login',
            credentials
        )
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

/**
 * Reducer for authentication
 */
export const authReducer = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        logout: (state, action) => {
            state.isLogged = false;
            state.user = null;
            localStorage.removeItem("user");
        }
    },
    extraReducers(builder) {
        builder
          .addCase(login.pending, (state, action) => {
            state.isLogged = false;
          })
          .addCase(login.fulfilled, (state, action) => {
            state.isLogged = true;
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload))
          })
          .addCase(login.rejected, (state, action) => {
            state.isLogged = false;
            state.error = action.payload.message;
          })
      }
})

export const selectUser = state => state.user.auth.user?.userInfo;
export const isLogged = state => state.user.auth.isLogged;

export const { logout } = authReducer.actions;

export default authReducer.reducer;