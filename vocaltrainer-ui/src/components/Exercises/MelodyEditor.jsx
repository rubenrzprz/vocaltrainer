import { Button, Grid, Card, CardContent, CardHeader, CardActions } from '@mui/material';
import { Formik, Form, FieldArray, Field } from 'formik';
import { TextField } from 'formik-mui';
import { object, array, number, string } from 'yup';
import { isNull } from 'lodash';
import { MidiNumbers } from 'react-piano';
import EditorTable from './EditorTable';

/**
 * Schema for the form validation
 */
const schema = object({
    name: string().required('Exercise cannot be saved without a name'),
    description: string(),
    melody: array(
        object({
            note: string().nullable().notOneOf([undefined], 'Note cannot be left empty'),
            octave: string().nullable().notOneOf([undefined], 'Octave cannot be left empty'),
            duration: number().required('Duration cannot be left empty').typeError('Only numbers are allowed')
        })
    ).min(1, 'A melody needs to have at least one note')
})

/**
 * Parses a melody to be used in the form
 * @param {*} melody to parse
 * @returns melody parsed to be consumed by the form 
 */
const melodyToForm = (melody) => melody.map((fragment, index) => {
    const { duration, midiNumber, note } = fragment;
    if(note) return { note, octave: fragment.octave, duration, position: index + 1};
    const { pitchName, octave } = isNull(midiNumber) ? { pitchName: null, octave: null } : MidiNumbers.getAttributes(midiNumber);
    return { note: pitchName, octave, duration: duration, position: index + 1 }
})

/**
 * Form that allows to edit a melody exercise
 */
const MelodyEditor = ({ melody, name = '', description = '', onSubmit, children, update }) => {
    const initialValue = () => {
        return {
            melody: melodyToForm(melody),
            name,
            description
        }
    }

    return (
        <Formik
            initialValues={initialValue()}
            validationSchema={schema}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ values }) => (
                <Form autoComplete="off">
                    <Grid container
                        direction={{ xs: 'column', lg: 'row' }}
                        spacing={5}
                    >
                        <Grid item xs={12}>
                                <Card>
                                    <CardHeader title='Melody exercise' />
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={3}>
                                                <Field
                                                    fullWidth
                                                    name="name"
                                                    component={TextField}
                                                    label="Name"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <Field
                                                    fullWidth
                                                    name="description"
                                                    component={TextField}
                                                    label="Description"
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            fullWidth
                                            disabled={!values.melody.length}
                                        >
                                            Submit
                                        </Button>
                                    </CardActions>
                                </Card>
                            <Grid item xs={12}>
                                {children}
                            </Grid>
                        </Grid>
                        <FieldArray name="melody">
                            {({ push, move, remove, insert }) => (
                                <>
                                    <Grid item xs={12}>
                                        {<EditorTable 
                                                rows={values.melody} 
                                                push={push} move={move} 
                                                remove={remove} 
                                                update={update} 
                                                values={values} 
                                                insert={insert}/> 
                                        }
                                    </Grid>
                                </>
                            )}
                        </FieldArray>
                    </Grid>
                </Form>
            )
            }
        </Formik >
    )
}

export default MelodyEditor;