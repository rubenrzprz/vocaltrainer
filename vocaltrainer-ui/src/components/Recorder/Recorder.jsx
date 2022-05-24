import React from 'react'
import { Button } from '@mui/material';
import _, { isNull } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { 
    play, 
    playNoteInput, 
    recordNote, 
    reset, 
    scheduleEvent, 
    selectActiveNotes, 
    selectConfig, 
    selectRecorder, 
    startRecording, 
    stop, 
    stopNoteInput, 
    stopRecording 
} from '../../store/reducers/melodyReducer';
import MelodyPlayer from '../Player/MelodyPlayer';

/**
 * Records a melody
 */
const Recorder = ({ width, styles }) => {
    const dispatch = useDispatch();
    const config = useSelector(selectConfig);
    const recorder = useSelector(selectRecorder);
    const activeNotes = useSelector(selectActiveNotes);
    const scheduledEvents = [];

    /**
     * Gets the current time
     * @returns current time
     */
    const setTime = () => new Date().getTime();
    
    /**
     * Gets the duration of an event
     * @returns time elapsed between last starting time and now
     */
    const getDuration = () => recorder.startingTime ? (setTime() - recorder.startingTime) / 1000 : 0;

    /**
     * Parses an array of range to and object with first and last
     * @returns object with first and last note
     */
    const getRange = () => {
        const { range } = config;
        return {
            first: range[0],
            last: range[1]
        }
    }

    /**
     * Gets the end time of a melody
     * @returns end time
     */
    const getRecordingEndTime = () => {
        if (recorder.events.length === 0) {
            return 0;
        }
        return Math.max(
            ...recorder.events.map((event) => event.time + event.duration) || 0
        );
    };

    /**
     * Plays the melody
     */
    const onClickPlay = () => {
        dispatch(play());
        const startAndEndTimes = _.uniq(
            _.flatMap(recorder.events, (event) => [
                event.time,
                event.time + event.duration
            ])
        );
        startAndEndTimes.forEach((time) => {
            scheduledEvents.push(setTimeout(() => {
                const currentEvents = recorder.events.filter((event) => {
                    return event.time <= time && event.time + event.duration > time && event.midiNumber !== null;
                });
                dispatch(scheduleEvent(currentEvents));
            }, time * 1000))
        });
        setTimeout(() => {
            onClickStop();
        }, getRecordingEndTime() * 1000);
    };

    /**
     * Stops the melody from being played
     */
    const onClickStop = () => {
        dispatch(stop())
        scheduledEvents.forEach(event => {
            clearTimeout(event);
        })
    };

    /**
     * Clears the current melody
     */
    const onClickClear = () => {
        onClickStop();
        dispatch(reset())
    };

    /**
     * Record the notes in the melody
     * @param {*} midiNumbers to record
     * @param {*} duration of the note
     * @returns 
     */
    const recordNotes = (midiNumbers, duration) => {
        if (recorder.status !== 'recording') {
            return;
        }
        const newEvents = isNull(midiNumbers) ? [{
            midiNumber: null,
            time: recorder.currentTime,
            duration: duration
        }] :
            midiNumbers.map(midiNumber => {
                return {
                    midiNumber,
                    time: recorder.currentTime,
                    duration
                }
            });
        dispatch(recordNote({ events: newEvents, currentTime: duration }))
    }
    /**
     * Handles the click of a key in the keyboard
     */
    const onPlayNoteInput = () => {
        if (recorder.status !== 'recording') return ;
        if (recorder.silence) {
            recordNotes(null, getDuration())
        }
        dispatch(playNoteInput(setTime()))
    }
    /**
     * Record the melodies after the user stops clicking a melody
     */
    const onStopNoteInput = (midiNumber, { prevActiveNotes }) => {
        if (recorder.status !== 'recording') return ;
        if (recorder.notesRecorded === false) {
            const duration = getDuration();
            recordNotes(prevActiveNotes, duration);
            dispatch(stopNoteInput(setTime()))
        }
    }

    /**
     * Start the recording status
     */
    const startRecordingNotes = () => {
        dispatch(startRecording());
    }

    /**
     * Stops the recording status
     */
    const stopRecordingNotes = () => {
        dispatch(stopRecording())
    }

    return (
        <>
            <MelodyPlayer
                recorder={recorder}
                instrumentName={config.instrument}
                onPlayNoteInput={onPlayNoteInput}
                onStopNoteInput={onStopNoteInput}
                activeNotes={activeNotes}
                width={width}
                styles={styles}
                noteRange={getRange()}
                onClickPlay={onClickPlay}
                onClickStop={onClickStop}

            >
                <Button variant="contained" onClick={onClickClear} disabled={!recorder.events.length}>Clear</Button>
                {recorder.status === 'recording' ?
                    <Button variant="contained" onClick={stopRecordingNotes}>Stop recording</Button> :
                    <Button variant="contained" onClick={startRecordingNotes} disabled={recorder.status === 'playing'}>Start recording</Button>
                }
            </MelodyPlayer>
        </>
    )
}

export default Recorder;