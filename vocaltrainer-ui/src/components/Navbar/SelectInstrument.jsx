
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import React from 'react';

/**
 * Select for choosing the instrument
 */
const SelectInstrument = ({setInstrument, instrumentList, instrument}) => {
    return (
        <>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="instrument-select-helper-label">Instrument</InputLabel>
                <Select
                    labelId="instrument-select-helper-label"
                    id="instrument-select"
                    label="Instrument"
                    onChange={setInstrument}
                    value={instrument}
                >
                    {instrumentList.map(item => (
                        <MenuItem key={item.instrument} value={item.instrument}>{item.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
}

export default SelectInstrument;