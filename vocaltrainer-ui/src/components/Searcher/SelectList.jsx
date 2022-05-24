import { useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

/**
 * Select component with custom handle change
 */
const SelectList = (props) => {
    const [value, setValue] = useState(props.value.api);
    const {label, itemList} = props;
    /**
     * Handles the selected value cahnge
     * @param {*} event 
     */
    const handleChange = (event) => {
        const selectedValue = event.target.value;
        setValue(selectedValue);
        props.setValue(selectedValue);
    }
    return (
        <>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id={label.id}>{label.text}</InputLabel>
                <Select
                    labelId={label.id}
                    id={props.id}
                    value={value}
                    label={label.text}
                    onChange={handleChange}
                >
                    {itemList.map(item => (
                        <MenuItem key={item.api} value={item.api}>{item.find}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    )
}

export default SelectList;