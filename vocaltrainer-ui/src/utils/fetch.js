import axios from 'axios';

/**
 * Provides a client for making public api calls
 */
const publicFetch = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
});

export {publicFetch};