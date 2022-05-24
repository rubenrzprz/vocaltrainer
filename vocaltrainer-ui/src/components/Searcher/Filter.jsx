import React, { useContext, useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { SearchContext } from '../../contexts/SearchContext';

/**
 * Filter
 */
const Filter = (props) => {
    const { options, name, api } = props.filter;
    const [checked, setChecked] = useState(options.find(option => option.selected).api);
    const searchContext = useContext(SearchContext);

    /**
     * Gets the url needed to match an specific filter
     * @param {*} value selected option
     * @returns the url for making the api call
     */
    const getUrlObject = (value) => {
        let filter = {};
        filter[name] = props.rootOption.api + api + value;
        return filter;
    }

    /**
     * Sets filters everytime an option changes
     * @param {*} event 
     */
    const handleChange = (event) => {
        const {value} = event.target;
        setChecked(value);
        searchContext.addFilters(getUrlObject(value))
    }

    useEffect(() => {
        searchContext.addFilters(getUrlObject(checked))
    }, [searchContext, checked])


    return (
        <FormControl>
            <FormLabel id="radio-buttons-group-label">{name}</FormLabel>
            <RadioGroup
                row
                aria-labelledby="radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={handleChange}
            >
                {options.map(filter => {
                    const {name, api} = filter;
                    return (
                        <FormControlLabel key={api} value={api} control={<Radio />} label={name} checked={api === checked}/>
                    )
                })}
            </RadioGroup>
        </FormControl>
    );
}

export default Filter;