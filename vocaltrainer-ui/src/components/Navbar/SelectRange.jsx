import { useState } from 'react';
import Slider from '@mui/material/Slider';
import { MidiNumbers } from 'react-piano';

/**
 * Gets the ntoe name from a midinumber
 * @param {*} number midinumber of the note
 * @returns note name with octave
 */
const getNoteFromNumber = (number) => MidiNumbers.getAttributes(number).note;
const minValue = 21;
const maxValue = 108;

/**
 * Select for chosing the range
 */
const SelectRange = ({ setRange, range, minSep, withMarks = true }) => {
    const initialRange = range ?? [48, 72];
    const minRange = minSep ?? 12;
    const [value, setValue] = useState(initialRange)
    
    /**
     * Handles the change of the slider component
     * @param {*} event 
     * @param {*} newValue 
     * @param {*} activeThumb 
     */
    const handleChange = (event, newValue, activeThumb) => {
        const changedValue = activeThumb === 0 ? [Math.min(newValue[0], value[1] - minRange), value[1]] : [value[0], Math.max(newValue[1], value[0] + minRange)];
        setValue(changedValue);
        setRange(changedValue);
    }
    const marks = [...Array(maxValue - minValue + 1)].map((_, index) => index + minValue)
        .map(value => ({attributes: MidiNumbers.getAttributes(value), value}))
        .filter(({attributes}) => !attributes.isAccidental)
        .map(({ value }) => ({value}));
    return (
        <Slider
            getAriaLabel={() => 'Notes range'}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(number) => getNoteFromNumber(number)}
            getAriaValueText={(number) => getNoteFromNumber(number)}
            min={minValue}
            max={maxValue}
            step={withMarks ? null : 1}
            marks={withMarks ? marks : null}
            disableSwap
        />
    )
}
export default SelectRange;