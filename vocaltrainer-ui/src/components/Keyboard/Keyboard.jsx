import React from 'react';
import { Piano } from 'react-piano';

import 'react-piano/dist/styles.css';
import SoundfontProvider from './SoundfontProvider';

/**
 * Keyboard component with the sound provider
 */
const Keyboard = ({
    instrumentName, 
    audioContext, 
    soundfontHostname,
    onPlayNoteInput, 
    onStopNoteInput, 
    activeNotes, 
    width, 
    noteRange
}) => {
    return (
        <SoundfontProvider
            instrumentName={instrumentName}
            audioContext={audioContext}
            hostname={soundfontHostname}
            render={({ isLoading, playNote, stopNote }) => (
                <Piano
                    playNote={playNote}
                    stopNote={stopNote}
                    onPlayNoteInput={onPlayNoteInput}
                    onStopNoteInput={onStopNoteInput}
                    activeNotes={activeNotes}
                    disabled={isLoading}
                    width={width}
                    noteRange={noteRange}
                />
            )}
        />
    )
}

export default Keyboard;