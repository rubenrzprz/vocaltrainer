import axios from "axios";

/**
 * Gets the value for authorization header
 * @returns authorization header value
 */
const getAuthorization = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user && user.token) return `Bearer ${user.token}`
    return '';
}

/**
 * Client for making api calls
 */
const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'
})

authAxios.interceptors.request.use((config) => {
        config.headers.Authorization = getAuthorization();
        return config;
    }
)

authAxios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        const code = error && error.response ? error.response.status : 0;
        if(code === 401 || code === 403) {
            console.log('error code = ', code);
        }
        return Promise.reject(error); 
    }
)

export default authAxios;