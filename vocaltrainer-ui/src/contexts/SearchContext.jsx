import { createContext, useState } from "react";

const SearchContext = createContext();
const { Provider } = SearchContext;

/**
 * Wraps the selected filters
 */
const SearchProvider = ({children}) => {
    const [filters, setFilters] = useState({});

    /**
     * Append a new filter
     * @param {*} filter to add
     */
    const addFilters = (filter) => {
        setFilters(Object.assign(filters, filter));
    }

    /**
     * Reset all the filters
     */
    const resetFilters = () => {
        setFilters({});
    }

    return(
        <Provider
            value={{
                filters,
                addFilters,
                resetFilters
            }}
        >
            {children}
        </Provider>
    )
}

export { SearchContext, SearchProvider };