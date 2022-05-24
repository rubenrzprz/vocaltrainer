import React, { useEffect, useState } from 'react'
import ExerciseCard from '../Cards/ExerciseCard';
import Stack from '@mui/material/Stack';
import Alert from '../Common/Alert';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, IconButton, Tooltip, Container, Card } from '@mui/material';
import { AddBox } from '@mui/icons-material'
import { fetchDashboard, removePublication, selectDashboardData } from '../../store/reducers/dashboardReducer';
import { useSelector, useDispatch } from 'react-redux'
import { selectUser } from '../../store/reducers/authReducer';

const CATEGORIES = [
    {
        title: 'Melody exercises',
        type: 'm-exercise',
        tooltip: 'melody exercise',
        link: '/record/melody'
    },
    {
        title: 'Breathing exercises',
        type: 'b-exercise',
        tooltip: 'breathing exercise',
        link: '/record/breathing'
    }
];

/**
 * Formats the title of the dashboard section
 * @param {*} name username
 * @returns formatted title
 */
const getDashboardTitle = (name) => `${name}'${(/[sS]/.test(name.slice(-1)) ? '' : 's')} Dashboard`

const Dashboard = () => {
    const dispatch = useDispatch();
    const dashboardSelector = useSelector(selectDashboardData)
    const userData = useSelector(selectUser);
    const dashboardStatus = useSelector(state => state.user.dashboard.status)
    const error = useSelector(state => state.user.dashboard.error)
    const [dashboardData, setDashboardData] = useState([]);
    const navigate = useNavigate();
    const [alert, setAlert] = useState({
        isOpen: false,
        message: 'You are not supossed to see this message. Ups!'
    });

    /**
     * Sets the dashboard data to match the one in the store
     */
    useEffect(() => {
        setDashboardData(Object.assign({ ...dashboardData }, dashboardSelector))
    }, [dashboardSelector])

    /**
     * Fetches the dashboard data
     */
    useEffect(() => {
        if (dashboardStatus === 'idle') {
            dispatch(fetchDashboard(userData.userId))
        }
    }, [dashboardStatus, dispatch, userData])

    /**
     * Shows an error as an alert
     */
    useEffect(() => {
        if (error !== null) {
            setAlert({
                isOpen: true,
                message: 'An error happened! ' + error
            })
        }
    }, [error])

    /**
     * Deletes a publication
     * @param {*} publicationId id of the publication to delete
     */
    const deletePublication = (publicationId) => {
        dispatch(removePublication(publicationId))
    }

    return (
        <Container>
            {userData &&
                <Typography variant="h2">{getDashboardTitle(userData.username)}</Typography>
            }
            <Grid
                container
                spacing={1}
            >
                {dashboardData &&
                    <>
                        {CATEGORIES.map(category => (
                            <Grid item xs={6} key={category.type}>
                                <h1>{category.title}
                                    <Tooltip title={`Create a new ${category.tooltip}`}>
                                        <IconButton onClick={() => navigate(category.link)}>
                                            <AddBox />
                                        </IconButton>
                                    </Tooltip>
                                </h1>

                                {dashboardData[category.type]?.length ?
                                    (<Grid container spacing={2} justifyContent="center" gap={3}>
                                        {dashboardData[category.type].map(exercise => (
                                            <ExerciseCard
                                                data={exercise}
                                                key={exercise.publicationId}
                                                deletePublication={deletePublication}
                                                xs={4}
                                            />
                                        ))
                                        }
                                    </Grid>) : (<Box>No publications found</Box>)
                                }
                            </Grid>
                        ))}
                    </>
                }
            </Grid>
            <Alert alert={alert} setAlert={setAlert} />
        </Container>
    )
}

export default Dashboard;