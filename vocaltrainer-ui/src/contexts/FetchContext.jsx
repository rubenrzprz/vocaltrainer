import { createContext } from "react";
import  authAxios  from "../store/authAxios";

const FetchContext = createContext();
const { Provider } = FetchContext;

/**
 * Provides the axios client for making the api calls
 */
const FetchProvider = ({children}) => {
    const axiosClient = authAxios;

    return(
        <Provider
            value={{
                authAxios: axiosClient
            }}
        >
            {children}
        </Provider>
    )
}

export { FetchContext, FetchProvider };