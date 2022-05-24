import { Box, FormControlLabel, Grid, MenuItem, Switch, TextField } from "@mui/material";
import _, { isNull } from "lodash";
import { useState } from "react";
import PatternInfo from "../components/Exercises/PatternInfo";
import MelodyPlayer from "../components/Player/MelodyPlayer";
import { parseTime, transposeMelody } from "../utils/melodyParsing";
import { getRangeMelody } from "../utils/melodyParsing";

const [MIN_NOTE, MAX_NOTE] = [21, 108];
const MAX_TRANSPOSE = 12;
const patterns = [
    { value: 0, label: "➝ ↗ ↘ ↗➝", description: "Starts on original tone, scales up, goes down to the lowest tone and finally up to the original tone" },
    { value: 1, label: "↗ ↘", description: "Starts on lowest note, scales up to the highest note and finally goes all the way down to where it started" },
    { value: 2, label: "↘ ↗", description: "Starts on the highest note, scales down to the lowest note to end up going all the way up to where it started"},
    { value: 3, label: "↗ ↘↗ ➝", description: "Starts on lowest note, scales up to the highest note, goes all the way down to the bottom and finally goes up to the original tone" },
    { value: 4, label: "↘ ↗↘ ➝", description: "Starts on the highest note, scales down to the lowest note, goes up to the highest note and ends up going down again to the original tone" },
    { value: 5, label: "↗", description: "Starts on lowest note and scales up to the highest note" },
    { value: 6, label: "↘", description: "Starts on highest note and scales down to the lowest note" },
]

/**
 * Melody player page
 */
const MelodyPlayerPage = ({ melody }) => {
    const scheduledEvents = [];
    const [events, setEvents] = useState([]);
    const [currentMelody, setCurrentMelody] = useState([...melody]);
    const [practiseMode, setPractiseMode] = useState(false);
    const [sleepTime, setSleepTime] = useState(1);
    const [numUpper, setNumUpper] = useState(0);
    const [numBelow, setNumBelow] = useState(0);
    const [pattern, setPattern] = useState(0);

    /**
     * Plays a melody
     * @param {*} melody 
     */
    const play = (melody) => {
        const parsedTimeMelody = parseTime(melody).filter(fragment => !isNull(fragment.midiNumber));
        const startAndEndTimes = _.uniq(
            _.flatMap(parsedTimeMelody, (event) => [
                event.time,
                event.time + event.duration
            ])
        );
        startAndEndTimes.forEach((time) => {
            scheduledEvents.push(setTimeout(() => {
                const currentEvents = parsedTimeMelody.filter((event) => {
                    return event.time <= time && event.time + event.duration > time && event.midiNumber !== null;
                });
                setEvents(currentEvents);
            }, time * 1000))
        });
    }

    /**
     * Plays the current melody
     */
    const onClickPlay = () => {
        play(currentMelody);
    };

    /**
     * Handles the select change
     * @param {*} event 
     */
    const handleTranspose = (event) => {
        setCurrentMelody(transposeMelody(melody, event.target.value) || Object.assign([], currentMelody));
    }

    /**
     * Gets an array of numbers
     * @param {*} amplitude number of values to generate
     * @param {*} start starting position
     * @returns array of numbers
     */
    const getTransposingValues = (amplitude, start = 0) => [...Array(amplitude)].map((_, index) => index - amplitude + start);
    /**
     * Gets the maximum transpose than a melody can have without exceeding the limits
     * @param {*} melody 
     * @returns lowest transponse posible and highest transpose posible
     */
    const getMaxAmplitude = (melody) => {
        const { first, last } = getRangeMelody(melody, { first: melody[0].midiNumber, last: melody[0].midiNumber })
        return { low: first - MIN_NOTE, high: MAX_NOTE - last };
    }

    /**
     * Makes a value fit inside a range
     * @param {*} value to validate
     * @param {*} min value alloweed
     * @param {*} max valued allowed
     * @param {*} defaultValue if not a number
     * @returns value fitted
     */
    const handleNumericChange = (value, min, max, defaultValue) => {
        if (value < min) value = min;
        if (value > max) value = max;
        if (isNaN(Number(value))) value = defaultValue;
        return Number(value);
    }

    /**
     * Handles the pause between transposes input
     * @param {*} event 
     */
    const handlePause = (event) => {
        let { value } = event.target;
        const min = 0.5, max = 8;
        setSleepTime(handleNumericChange(value, min, max, 1));
    }

    const maxAmplitude = getMaxAmplitude(currentMelody);

    /**
     * Handles the higher and lower repetitions inputs
     * @param {*} event 
     * @param {*} setter function that sets the state
     * @param {*} maxValue allowed for the repetitions
     */
    const handleRepetitions = (event, setter, maxValue) => {
        let { value } = event.target;
        setter(handleNumericChange(value, 0, maxValue, 0));
    }

    /**
     * Gets the ending time of the melody
     * @returns ending time of the melody
     */
    const getEndTime = () => melody.reduce((acc, sum) => acc + sum.duration, 0);

    /**
     * Plays the melody following the pattern and repetitions selected 
     */
    const iterateMelody = async () => {
        /**
         * Creates a promise that resolves after a timeout
         * @param {*} ms duration in ms for the promise to be resolved
         * @returns resolved promise after time
         */
        const timer = ms => new Promise(res => setTimeout(res, ms));
        /**
         * Transpose the melody by the iterator
         * @param {*} iterator 
         */
        const iteration = async (iterator) => {
            const transposedMelody = transposeMelody(melody, iterator)
            play(transposedMelody);
            await timer(getEndTime() * 1000 + sleepTime * 1000)
        }
        /**
         * Iterates the melody up to the max value
         * @param {*} iterator starting value
         * @param {*} max value to iterate
         */
        const upperIteration = async (iterator, max) => {
            while (iterator <= max) {
                await iteration(iterator);
                iterator++;
            }
        }
        /**
         * Iterates the melody down to the min value
         * @param {*} iterator starting value
         * @param {*} min value to iterate
         */
        const lowerIteration = async (iterator, min) => {
            while (iterator >= min) {
                await iteration(iterator);
                iterator--;
            }
        }
        switch (pattern) {
            case 0:
                await upperIteration(0, numUpper);
                await lowerIteration(numUpper - 1, -numBelow);
                await upperIteration(-numBelow + 1, 0);
                return;
            case 1:
                await upperIteration(-numBelow, numUpper);
                await lowerIteration(numUpper - 1, -numBelow);
                return;
            case 2:
                await lowerIteration(numUpper, -numBelow);
                await upperIteration(-numBelow + 1, numUpper);
                return;
            case 3:
                await upperIteration(-numBelow, numUpper);
                await lowerIteration(numUpper - 1, -numBelow);
                await upperIteration(-numBelow + 1, 0);
                return;
            case 4:
                await lowerIteration(numUpper, -numBelow);
                await upperIteration(-numBelow + 1, numUpper);
                await lowerIteration(numUpper - 1, 0);
                return;
            case 5:
                await upperIteration(-numBelow, numUpper);
                return;
            case 6:
                await lowerIteration(numUpper, -numBelow);
                return;
            default:
                return;
        }
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                    <TextField onChange={handleTranspose} select defaultValue={0} label="Transpose" sx={{ minWidth: 100 }}>
                        {maxAmplitude.low > 0 && getTransposingValues(maxAmplitude.low > MAX_TRANSPOSE ? MAX_TRANSPOSE : maxAmplitude.low).map(value => (
                            <MenuItem key={value} value={value} label={value}>{value}</MenuItem>
                        ))}
                        <MenuItem value={0} label={0}>0</MenuItem>
                        {maxAmplitude.high > 0 && getTransposingValues(maxAmplitude.high > MAX_TRANSPOSE ? MAX_TRANSPOSE : maxAmplitude.high, maxAmplitude.high > MAX_TRANSPOSE ? MAX_TRANSPOSE + 1 : maxAmplitude.high + 1).map(value => (
                            <MenuItem key={value} value={value} label={value}>{value}</MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <MelodyPlayer
                    noteRange={getRangeMelody(currentMelody)}
                    styles={{ height: '200px' }}
                    onClickPlay={practiseMode ? iterateMelody : onClickPlay}
                    activeNotes={events.map(event => event.midiNumber)}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel label="Practise exercise with transpose" control={<Switch checked={practiseMode} onChange={() => setPractiseMode(!practiseMode)} />} />
            </Grid>
            {practiseMode &&
                <Grid container item xs={12} spacing={4} justifyContent='center'>
                    <Grid item>
                        <TextField
                            type="number"
                            inputProps={{ step: 0.1 }}
                            onChange={handlePause}
                            value={sleepTime}
                            label="Pause between pitch change"
                            sx={{ minWidth: 100 }} />
                    </Grid>
                    <Grid item>
                        <TextField
                            type="number"
                            onChange={(e) => handleRepetitions(e, setNumUpper, maxAmplitude.high)}
                            value={numUpper}
                            label="Transpose up"
                            sx={{ minWidth: 100 }} />
                    </Grid>
                    <Grid item>
                        <TextField
                            type="number"
                            onChange={(e) => handleRepetitions(e, setNumBelow, maxAmplitude.low)}
                            value={numBelow}
                            label="Transpose down"
                            sx={{ minWidth: 100 }} />
                    </Grid>
                    <Grid item>
                        <TextField
                            onChange={(e) => setPattern(e.target.value)}
                            value={pattern}
                            label="Exercise pattern"
                            sx={{ minWidth: 225 }}
                            select
                        >
                            {patterns.map(option => (
                                <MenuItem key={option.value} value={option.value} label={option.label}>{option.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <PatternInfo patterns={patterns}/>
                    </Grid>
                </Grid>
            }
        </Grid>
    )
}

export default MelodyPlayerPage;