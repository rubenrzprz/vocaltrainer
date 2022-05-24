import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar'
import Recorder from '../components/Recorder/Recorder'
import { Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { saveMelodyExercise, selectConfig, selectRecorder, updateMelody } from '../store/reducers/melodyReducer';
import MelodyEditor from '../components/Exercises/MelodyEditor';
import { fetchDashboard } from '../store/reducers/dashboardReducer';
import { noteToMidiNumber, parseTime } from '../utils/melodyParsing';
import { selectUser } from '../store/reducers/authReducer';

const windowDim = Dimensions.get('window');
const screenDim = Dimensions.get("screen");

/**
 * Melody recorder page
 */
const MelodyRecorderPage = (props) => {
    const dispatch = useDispatch();
    const config = useSelector(selectConfig);
    const [dimensions, setDimensions] = useState({ window: windowDim, screen: screenDim });
    const recorder = useSelector(selectRecorder);
    const userData = useSelector(selectUser);

    useEffect(() => {
        const subscription = Dimensions.addEventListener(
            "change",
            ({ window, screen }) => {
                setDimensions({ window, screen });
            }
        );
        return () => subscription?.remove();
    });

    /**
     * Saves the melody in the server
     * @param {*} data 
     */
    const onSubmit = async (data) => {
        try {
            dispatch(saveMelodyExercise(data))
            dispatch(fetchDashboard(userData.userId))
        } catch {

        }
    }

    /**
     * Updates the recorded melody in the store
     * @param {*} values 
     */
    const updateRecordedMelody = (values) => {
        const { name, description, melody } = values;
        const parsedMelody = parseTime(melody.map(_ => noteToMidiNumber(_)));
        dispatch(updateMelody({name, description, melody: parsedMelody}))
    }


    return (
        <>
            {config &&
                    <MelodyEditor 
                        onSubmit={onSubmit} 
                        update={updateRecordedMelody}
                        melody={recorder.events}
                        name={recorder.name}
                        description={recorder.description}
                        >
                        <Navbar
                            instrumentList={config.instrumentList}
                            instrument={config.instrument}
                            range={config.range}
                        />
                        <Recorder
                            width={dimensions.width}
                            styles={{ height: '200px' }}
                        />
                    </MelodyEditor>
            }
        </>
    )
}

export default MelodyRecorderPage;