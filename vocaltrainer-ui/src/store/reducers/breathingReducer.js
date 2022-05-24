import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import authAxios from '../authAxios';

const initialState = {
    status: 'not_started',
    exercise: [],
    error: null
}

/**
 * Saves a breathing exercise
 */
export const saveBreathingExercise = createAsyncThunk('breathing/saveBreathingExercise', async (publication, {rejectWithValue}) => {
    try {
        const { name, description } = publication;
        const { data } = await authAxios.post(
            'publications',
            {
                name,
                description,
                type: 'b-exercise'
            }
        )
        const { breathing } = publication;
        const { publicationId } = data;
        await authAxios.post(
            'breathingFragments/fullExercise',
            {
                exerciseId: publicationId,
                exercise: breathing
            }
        )
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

/**
 * Updates a breathing exercise
 */
export const updateBreathingExercise = createAsyncThunk('breathing/updateBreathingExercise', async ({original, newPublication}, {rejectWithValue}) => {
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
                `breathingFragments/${info.publicationId}`,
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
 * Reducer for breathing exercises
 */
export const breathingSlice = createSlice({
    name: 'breathing',
    initialState: initialState,
    reducers: {
        addExercise(state, action) {
            state.exercise = action.payload;
            state.status = 'working'
        }
    },
    extraReducers(builder) {
        builder
            .addCase(saveBreathingExercise.pending, (state, action) => {
                state.status = 'saving';
            })
            .addCase(saveBreathingExercise.fulfilled, (state, action) => {
                state.status = 'saved';
                state.data = [];
            })
            .addCase(saveBreathingExercise.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})

export default breathingSlice.reducer;