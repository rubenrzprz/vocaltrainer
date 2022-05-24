import { configureStore, combineReducers } from '@reduxjs/toolkit';
import  authReducer from './reducers/authReducer';
import breathingReducer from './reducers/breathingReducer';
import dashboardReducer from './reducers/dashboardReducer';
import melodyReducer from './reducers/melodyReducer';
import profileReducer from './reducers/profileReducer';
import userReducer from './reducers/userReducer';

const userInfoReducer = combineReducers({
    dashboard: dashboardReducer,
    profile: profileReducer,
    userInfo: userReducer,
    auth: authReducer
})

const exercisesReducer = combineReducers({
    breathing: breathingReducer,
    melody: melodyReducer
})

/**
 * Main app reducer
 */
const store = configureStore({
    reducer: {
        user: userInfoReducer,
        exercises: exercisesReducer
    }
});

export default store;