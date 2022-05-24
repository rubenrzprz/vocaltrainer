import Paper from '@mui/material/Paper';
import { Field } from 'formik';
import { TextField } from 'formik-mui';
import { Button, Container, Grid, MenuItem, Stack, Typography, Box } from '@mui/material';
import { isNull } from 'lodash';
import { notes, octaves } from '../../utils/melodyParsing';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ActionsDial from './ActionsDial';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

const defaultNote = { note: 'C', octave: 4, duration: 1 };
const silence = { note: null, octave: null, duration: 1 };

const rowActions = (addNote, addSilence, remove) => [
    { icon: <ExpandCircleDownIcon />, name: 'Add note below', action: addNote },
    { icon: <ExpandCircleDownIcon color='success' />, name: 'Add silence below', action: addSilence },
    { icon: <DeleteIcon color='error' />, name: 'Remove', action: remove },
];

const topActions = (addNote, addSilence) => [
    { icon: <ExpandCircleDownIcon />, name: 'Add note', action: addNote },
    { icon: <ExpandCircleDownIcon color='success' />, name: 'Add silence', action: addSilence }
]

/**
 * Displays the data of a melody exercise inside an accordion
 */
const EditorTable = ({ rows, push, remove, update, values, insert }) => {
    const [open, setOpen] = useState(false);
    return (
        <Accordion
            expanded={open}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
                onClick={() => setOpen(!open)}
            >
                <Typography>Exercise Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Container component={Paper}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <ActionsDial actions={topActions(
                                () => push(defaultNote),
                                () => push(silence)
                            )}></ActionsDial>
                        </Grid>
                        {rows.map((field, index) => (
                            <Grid item container key={index} xs={12} spacing={2}>
                                {!isNull(field.note) ? (
                                    <>
                                        <Grid item xs={12} md={3}>
                                            <Field
                                                name={`melody.${index}.note`}
                                                label="Note"
                                                component={TextField}
                                                select
                                                fullWidth
                                            >
                                                {notes.map(({ value, label }) => (
                                                    <MenuItem key={value} value={value}>{label}</MenuItem>
                                                ))}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Field
                                                name={`melody.${index}.octave`}
                                                label="Octave"
                                                component={TextField}
                                                select
                                                fullWidth
                                            >
                                                {octaves.map(({ value, label }) => (
                                                    <MenuItem key={value} value={value}>{label}</MenuItem>
                                                ))}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Field
                                                name={`melody.${index}.duration`}
                                                label="Duration"
                                                component={TextField}
                                            />
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="p" align="center">Silence</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Field
                                                name={`melody.${index}.note`}
                                                label="Note"
                                                type="hidden"
                                                value='null'
                                            />
                                            <Field
                                                name={`melody.${index}.octave`}
                                                label="Octave"
                                                type="hidden"
                                                value='null'
                                            />
                                            <Field
                                                name={`melody.${index}.duration`}
                                                label="Duration"
                                                component={TextField}
                                            />
                                        </Grid>
                                    </>
                                )}
                                <Grid item xs={12} md={3}>
                                    <Box display="flex" justifyContent="center">
                                        <ActionsDial
                                            actions={rowActions(
                                                () => insert(index + 1, defaultNote),
                                                () => insert(index + 1, silence),
                                                () => remove(index)
                                            )}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>

                        ))}
                        <Grid item xs={12}>
                            <Stack direction="row">
                                <Button
                                    variant="contained"
                                    onClick={() => push(defaultNote)}
                                    fullWidth
                                >
                                        Add note
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => push(silence)}
                                    fullWidth
                                    color="success"
                                >
                                    Add silence
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setOpen(false)}
                                    fullWidth
                                    color="warning"
                                >
                                    Close details
                                </Button>
                            </Stack>

                            <Button
                                variant="contained"
                                onClick={() => update(values)}
                                fullWidth
                                color="info"
                            >
                                Update melody
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </AccordionDetails >
        </Accordion >
    );
}

export default EditorTable;