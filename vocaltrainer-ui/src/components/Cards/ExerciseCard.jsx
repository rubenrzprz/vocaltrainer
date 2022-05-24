import React from 'react'
import {
    Card, CardActions, CardContent,
    Typography, Tooltip, IconButton, CardHeader, Grid, styled
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Link } from 'react-router-dom';
import './cards.css';

/**
 * Styels for different breakpoints
 */
const Root = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        maxHeight: 'fit-content',
        width: '100%',
    },
    [theme.breakpoints.up('md')]: {
        maxHeight: 'minmax(fit-content, 150px)',
        width: '100%'
    }
}))

/**
 * Displays an exercise as a card
 */
const ExerciseCard = ({ data, deletePublication, xs, short }) => {
    const { name, updatedAt, type, publicationId } = data;

    return (
        <>
            {data &&
                <Root item component={Card} xs={xs} className={`card ${type} ${short ? 'short-card' : ''}` }>
                    <Link to={`/exercise/${publicationId}`} className='link container-flex'>
                        <CardHeader title={name} titleTypographyProps={{ variant: 'h6' }} />
                        <CardContent>
                            <Typography variant="p">Last update: {updatedAt.substring(0, 10)}</Typography>
                        </CardContent>
                    </Link>
                    {deletePublication &&
                        <CardActions>
                            <Tooltip title='Delete'>
                                <IconButton onClick={() => deletePublication(publicationId)} color="error">
                                    <DeleteRoundedIcon />
                                </IconButton>
                            </Tooltip>
                        </CardActions>
                    }
                </Root>
}
        </>
    )
}

export default ExerciseCard;