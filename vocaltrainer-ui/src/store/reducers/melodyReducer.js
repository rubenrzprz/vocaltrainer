import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAxios from '../authAxios';
import _, { isNull } from 'lodash';
import { MidiNumbers } from 'react-piano';
import { parseTime } from '../../utils/melodyParsing';

const instrumentList = [
    { name: 'Grand Piano', instrument: 'acoustic_grand_piano', default: true },
    { name: 'Choir', instrument: 'choir_aahs' },
    { name: 'Flute', instrument: 'flute' },
    { name: 'Violin', instrument: 'violin' }
];

const defaultRange = [48, 72];

const initialState = {
    status: 'not_started',
    error: null,
    config: {
        instrument: instrumentList.find(i => i.default).instrument,
        range: defaultRange,
        instrumentList
    },
    recorder: {
        name: '',
        description: '',
        status: 'idle',
        events: [],
        currentTime: 0,
        currentEvents: [],
        notesRecorded: true,
        silence: false,
        startingTime: null
    }
}

/**
 * Saves a melody exercise
 */
export const saveMelodyExercise = createAsyncThunk('melody/saveMelodyExercise', async (publication, {rejectWithValue}) => {
    try {
        const { name, description } = publication;
        const { data } = await authAxios.post(
            'publications',
            {
                name,
                description,
                type: 'm-exercise'
            }
        )
        const { melody } = publication;
        const parsedMelody = melody.map(fragment => {
            console.log(fragment);
            const { duration, note, octave } = fragment;
            return {
                duration,
                midiNumber: isNull(note) ? null : MidiNumbers.fromNote(note+octave)
            }
        })
        const { publicationId } = data;
        await authAxios.post(
            'melodyFragments/fullExercise',
            {
                exerciseId: publicationId,
                exercise: parsedMelody
            }
        )
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

/**
 * Updates a melody exercise
 */
export const updateMelodyExercise = createAsyncThunk('melody/updateMelodyExercise', async ({original, newPublication}, {rejectWithValue}) => {
    try {
        const { info, exercise } = original;
        const { newInfo, newExercise } = newPublication;
        if(info.name !== newInfo.name || info.description !== newInfo.description) {
            await authAxios.put(
                `publications/${info.publicationId}`,
                newInfo
            )
        }
        if(!_.isEqual(exercise, newExercise)) {
            await authAxios.put(
                `melodyFragments/${info.publicationId}`,
                {
                    exercise: newExercise
                }
            )
        }
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

/**
 * Melody exercise reducer
 */
export const melodySlice = createSlice({
    name: 'melody',
    initialState,
    reducers: {
        recordNote(state, action) {
            const {events, currentTime} = action.payload;
            const newEvents = [...state.recorder.events, ...events].filter((el, index, arr) => el.midiNumber !== arr[index+1]?.midiNumber);
            state.recorder.events = parseTime(newEvents);
            state.recorder.currentTime += currentTime;
        },
        setInstrument(state, action) {
            state.config.instrument = action.payload;
        },
        setRange(state, action) {
            state.config.range = action.payload;
        },
        setRecordingStatus(state, action) {
            state.recorder.status = action.payload;
        },
        playNoteInput(state, action) {
            state.recorder.startingTime = action.payload;
            state.recorder.notesRecorded = false;
            state.recorder.silence = false;
        },
        stopNoteInput(state, action) {
            state.recorder.startingTime = action.payload;
            state.recorder.notesRecorded = true;
            state.recorder.silence = true;
        },
        stop(state, action) {
            state.recorder.status = 'idle'
            state.recorder.currentEvents = [];
        },
        setCurrentEvents(state, action) {
            state.recorder.currentEvents = action.payload;
        },
        reset(state, action) {
            state.recorder = {...initialState.recorder};
        },
        play(state, action) {
            const { recorder } = state;
            recorder.status = 'playing';
        },
        scheduleEvent(state, action) {
            state.recorder.currentEvents = action.payload;
        },
        setSilence(state, action) {
            state.recorder.silence = action.payload;
        },
        startRecording(state, action) {
            state.recorder.status = 'recording';
            state.recorder.startingTime = null;
        },
        stopRecording(state, action) {
            state.recorder.status = 'idle';
        },
        updateMelody(state, action) {
            const { melody, name, description } = action.payload;
            state.recorder.events = melody;
            state.recorder.name = name;
            state.recorder.description = description;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(saveMelodyExercise.pending, (state, action) => {
                state.status = 'saving';
            })
            .addCase(saveMelodyExercise.fulfilled, (state, action) => {
                state.status = 'saved';
                state.data = [];
            })
            .addCase(saveMelodyExercise.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})

export const selectRecorder = state => state.exercises.melody.recorder;
export const selectConfig = state => state.exercises.melody.config;
export const selectScheduledEvents = state => state.exercises.melody.recorder.scheduledEvents;
export const selectActiveNotes = state =>  state.exercises.melody.recorder.status === 'playing' ? state.exercises.melody.recorder.currentEvents.map(event => event.midiNumber) : null;

export const { 
    recordNote, 
    setInstrument, 
    setRange, 
    setRecordingStatus, 
    setCurrentEvents,
    reset,
    stop,
    stopNoteInput,
    playNoteInput,
    play,
    scheduleEvent,
    setSilence,
    startRecording,
    stopRecording,
    updatePostition,
    updateMelody
} = melodySlice.actions;

export default melodySlice.reducer;