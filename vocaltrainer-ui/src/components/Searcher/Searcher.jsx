import { Grid, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { SearchContext } from "../../contexts/SearchContext";
import Filter from "./Filter";
import SelectList from "./SelectList";

const options = [
    {
        find: 'Publications',
        api: 'publications',
        default: true,
        filters: [
            {
                name: 'Type',
                api: '/type',
                options: [
                    {
                        name: 'All',
                        api: '/all',
                        selected: true
                    },
                    {
                        name: 'Melody exercises',
                        api: '/m-exercise'
                    },
                    {
                        name: 'Breathing exercises',
                        api: '/b-exercise'
                    }
                ]
            },
            {
                name: 'Last time updated',
                api: '/lastUpdate',
                options: [
                    {
                        name: 'Anytime',
                        api: '/all/all',
                        selected: true
                    },
                    {
                        name: 'Less than 3 months',
                        api: '/month/3'
                    },
                    {
                        name: 'Less than 1 month',
                        api: '/month/1'
                    },
                    {
                        name: 'Less than 2 weeks',
                        api: '/day/14'
                    },
                    {
                        name: 'This week',
                        api: '/day/7'
                    }
                ]
            }
        ]
    },
    {
        find: 'Users',
        api: 'users'
    }
]

const findDefault = (array) => array.find(el => el.default);
const getPlaceholder = (option) => `Find ${option.toLowerCase()}...`

const Searcher = (props) => {
    const [option, setOption] = useState(findDefault(options));
    const searchContext = useContext(SearchContext);

    /**
     * Handles the option change
     */
    const changeOption = (newValue) => {
        setOption(options.find(item => item.api === newValue));
        searchContext.resetFilters();
    }
    /**
     * Sets a filter for name everytime the user type in the text field
     * @param {*} event 
     */
    const handleChange = (event) => {
        const searchTerm = event.target.value.trim();
        let filter = {};
        filter['Term'] = searchTerm.length === 0 ? null : option.api + '/name/' + searchTerm;
        searchContext.addFilters(filter);
        props.setSearchTerm(searchTerm);
    }
    return (
        <>
            <Grid container
                alignItems="center"
            >
                <SelectList value={option} setValue={changeOption} label="Options" itemList={options} />
                <TextField type="search" aria-label={getPlaceholder(option.find)} placeholder={getPlaceholder(option.find)} onChange={handleChange}/>
            </Grid>
            <Grid container>
            {option.filters?.map(item => (
                <Grid item xs={12} key={item.api}>
                    <Filter filter={item} rootOption={option} />
                </Grid>
            ))}
            </Grid>
        </>
    )
}

export default Searcher;