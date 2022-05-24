import { isNull } from "lodash";
import { MidiNumbers } from "react-piano";

/**
 * Gets the range of a melody, i.e. its highest and lowest note
 * @param {*} melody array to det the range from
 * @param {*} defaultValues to start the range
 * @returns range of the melody
 */
export const getRangeMelody = (melody, defaultValues = { first: 48, last: 72}) => {
    const range = melody.reduce(
        (acc, sum) => {
            let { first, last } = acc;
            const { midiNumber } = sum;
            if (isNull(midiNumber)) return { first, last };
            if (midiNumber < first) first = midiNumber;
            if (midiNumber > last) last = midiNumber;
            return { first, last }
        }
        , defaultValues)
    let { first, last } = range;
    if(MidiNumbers.getAttributes(first).isAccidental) first -= 1;
    if(MidiNumbers.getAttributes(last).isAccidental) last += 1;
    return { first, last };
}

/**
 * Gets the midiNumber from an octave and note
 * @param {*} fragment
 * @returns an object with midiNumber
 */
export const noteToMidiNumber = (fragment) => {
    const { duration, note, octave } = fragment;
    return {
        duration: Number(duration),
        midiNumber: isNull(note) ? null : MidiNumbers.fromNote(note + octave)
    }
}

/**
 * Adds the position of the fragments to the melody
 */
export const addPosition = (melody) => melody.map((fragment, index) => ({...fragment, position: index+1}));

/**
 * Transposes a melody, i.e. makes it higher or lower
 * @param {*} melody to transpose
 * @param {*} amount how many tones up or down is going to be transpose
 * @returns transposed melody
 */
export const transposeMelody = (melody, amount) => {
    const [MIN_NOTE, MAX_NOTE] = [21, 108];
    if (melody.some(({ midiNumber }) => midiNumber === MIN_NOTE || midiNumber === MAX_NOTE)) return;
    return melody.map((fragment) => {
        let { midiNumber } = fragment;
        if (!isNull(midiNumber)) midiNumber += amount;
        return Object.assign(fragment, { midiNumber })
    });
}

/**
 * Sums all the times up to a position
 * @param {*} array
 * @param {*} position to get the time
 * @returns the time up to that position
 */
export const getTime = (array, position) => array.slice(0, position).map(fragment => fragment.duration).reduce((sum, acc) => sum + acc, 0)

/**
 * Update the time of the melody fragments to match the duration of themselves
 * @param {*} melody 
 * @returns updated melody with the time correctly parsed
 */
export const parseTime = (melody) => melody
    .map((fragment, index, arr) => {
        const { duration, midiNumber } = fragment;
        return { duration, midiNumber, time: Number(getTime(arr, index).toFixed(4)), position: index + 1 }
    })

/**
 * Gets an object from a value
 * @param {*} value
 * @returns an object with value and label
 */
const getLabelValue = (value) => ({ value, label: value })
export const octaves = [...Array(8).keys()].map(key => getLabelValue(key + 1));
export const notes = 'C Db D Eb E F Gb G Ab A Bb B'.split(/\s/).map(_ => (getLabelValue(_)));