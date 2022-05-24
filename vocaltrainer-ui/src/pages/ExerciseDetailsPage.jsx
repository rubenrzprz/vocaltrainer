import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../contexts/FetchContext';
import MelodyEditor from "../components/Exercises/MelodyEditor"
import BreathingEditor from '../components/Exercises/BreathingEditor';
import BreathingDetails from '../components/Exercises/BreathingDetails';
import { Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../store/reducers/authReducer';
import { updateBreathingExercise } from '../store/reducers/breathingReducer';
import MelodyPlayerPage from './MelodyPlayerPage';
import { addPosition, noteToMidiNumber, parseTime } from '../utils/melodyParsing';
import { updateMelodyExercise } from '../store/reducers/melodyReducer';

/**
 * Exercise details page
 */
const ExerciseDetailsPage = () => {
    const fetchContext = useContext(FetchContext)
    const { publicationId } = useParams();
    const [exerciseInfo, setExerciseInfo] = useState();
    const [details, setDetails] = useState();
    const userId = useSelector(selectUser).userId;
    const [isOwner, setIsOwner] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const getDetails = async (info) => {
            try {
                const api = info.type === 'm-exercise' ? 'melodyFragments' : 'breathingFragments'
                const { data } = await fetchContext.authAxios.get(
                    `${api}/${publicationId}`
                )
                setDetails(data);
            } catch {

            }
        }
        const getInfo = async () => {
            try {
                const { data } = await fetchContext.authAxios.get(
                    `publications/${publicationId}`,
                )
                setExerciseInfo(data);
                setIsOwner(data.userId === userId);
                getDetails(data);
            } catch {
            }
        }
        getInfo();
    }, [fetchContext, publicationId, userId])

    /**
     * Updates a breathing exercise in the server
     * @param {*} publication 
     */
    const onSubmitBreathing = async (publication) => {
        const original = { info: exerciseInfo, exercise: details };
        const newPublication = {
            newInfo: Object.assign({ ...exerciseInfo }, { name: publication.name, description: publication.description }),
            newExercise: publication.breathing
        }
        dispatch(updateBreathingExercise({ original, newPublication }));
        setDetails(newPublication.newExercise);
        setExerciseInfo(newPublication.newInfo);
    }

    /**
     * Updates a melody exercise in the server
     * @param {*} publication 
     */
    const onSubmitMelody = async (publication) => {
        const original = { info: exerciseInfo, exercise: details };
        const newPublication = {
            newInfo: Object.assign({ ...exerciseInfo }, { name: publication.name, description: publication.description }),
            newExercise: addPosition(publication.melody.map(_ => noteToMidiNumber(_)))
        }
        dispatch(updateMelodyExercise({ original, newPublication }));
        setDetails(newPublication.newExercise);
        setExerciseInfo(newPublication.newInfo);
    }

    /**
     * Updates the melody in the page
     * @param {*} values 
     */
    const updateMelody = (values) => {
        setDetails(parseTime(values.melody.map(_ => noteToMidiNumber(_))))
    }

    return (
        <Grid container spacing={2}>
            {isOwner &&
                <Grid item xs={12}>
                    <Button onClick={() => setEditMode(!editMode)}>Toggle edit</Button>
                </Grid>
            }
            {exerciseInfo &&
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title={`Exercise: ${exerciseInfo.name}`} />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography>{exerciseInfo.description}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            }
            {exerciseInfo && details && (exerciseInfo.type === 'm-exercise' ?
                (<Grid item xs={12}>
                    {editMode ?
                        (<MelodyEditor
                            melody={details}
                            name={exerciseInfo.name}
                            description={exerciseInfo.description}
                            update={updateMelody}
                            onSubmit={onSubmitMelody}
                        ></MelodyEditor>
                        ) :
                        (<MelodyPlayerPage
                            melody={details}
                        />)
                    }</Grid>)
                :
                (<Grid item>
                    {editMode ?
                        <BreathingEditor
                            breathing={details}
                            name={exerciseInfo.name}
                            description={exerciseInfo.description}
                            onSubmit={onSubmitBreathing}
                            buttonText="Update"
                        /> :
                        <BreathingDetails
                            exercise={details}
                            name={exerciseInfo.name}
                            description={exerciseInfo.description}
                        />
                    }
                </Grid>))
            }
        </Grid>
    )
}
export default ExerciseDetailsPage;