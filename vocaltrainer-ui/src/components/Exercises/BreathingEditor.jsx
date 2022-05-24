import { Button, Grid, Stack, Typography } from '@mui/material';
import { Formik, Form, FieldArray, Field } from 'formik';
import { TextField } from 'formik-mui';
import { object, array, number, string } from 'yup';

const defaultBreathing = { inhaleTime: 1, holdTime: 0, exhaleTime: 1, position: 1 };

/**
 * Schema to validate the form
 */
const schema = object({
    name: string().required('Exercise cannot be saved without a name'),
    description: string(),
    breathing: array(
        object({
            inhaleTime: number().required('Inhale time cannot be left empty').min(1, 'The minimum inhale time is 1').max(60, 'The maximum inhale time is 60').typeError('Only numbers are allowed'),
            holdTime: number().required('Hold time cannot be left empty').min(0, 'The minimum hold time is 0').max(60, 'The maximum hold time is 60').typeError('Only numbers are allowed'),
            exhaleTime: number().required('Exhale time cannot be left empty').min(1, 'The minimum exhale time is 1').max(60, 'The maximum exhale time is 60').typeError('Only numbers are allowed')
        })
    )
})

/**
 * Form that allows to edit a breathing exercise
 */
const BreathingEditor = ({onSubmit, breathing = [defaultBreathing], name = '', description = '', buttonText = 'Submit'}) => {
    const initialValues = {
        breathing,
        name,
        description
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={onSubmit}
        >
            {({ values }) => (
                <Form autoComplete="off">
                    <Grid container
                        direction="column"
                        spacing={5}
                    >
                        <Grid item>
                            <Field
                                fullWidth
                                name="name"
                                component={TextField}
                                label="Name"
                            />
                        </Grid>

                        <Grid item>
                            <Field
                                fullWidth
                                name="description"
                                component={TextField}
                                label="Description"
                            />
                        </Grid>
                        <FieldArray name="breathing">
                            {({ push, move, remove }) => (
                                <>
                                    <Grid item>
                                        <Typography variant="h5">
                                            Breathing exercise:
                                        </Typography>
                                    </Grid>
                                    {values.breathing.map((_, index) => (
                                        <Grid
                                            container
                                            item
                                            key={index}
                                            spacing={2}
                                            justifyContent="space-around"
                                        >
                                            <Grid item xs={12} sm={3}>
                                                <Field
                                                    name={`breathing.${index}.inhaleTime`}
                                                    label="Inhale time"
                                                    component={TextField}
                                                    type="number"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <Field
                                                    name={`breathing.${index}.holdTime`}
                                                    label="Hold time"
                                                    component={TextField}
                                                    type="number"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <Field
                                                    name={`breathing.${index}.exhaleTime`}
                                                    label="Exhale time"
                                                    component={TextField}
                                                    type="number"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <Stack direction="row">
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => move(index, index + 1)}
                                                    >
                                                        Move below
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => move(index, index - 1)}
                                                    >
                                                        Move above
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => remove(index)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <Grid
                                        item
                                    >
                                        <Button
                                            variant="contained"
                                            onClick={() => push({...defaultBreathing, position: values.breathing.length+1})}
                                            fullWidth
                                        >
                                            Add
                                        </Button>
                                    </Grid>
                                </>
                            )}
                        </FieldArray>
                    </Grid>
                    <Grid
                        item
                    >
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                        >
                            {buttonText}
                        </Button>
                    </Grid>
                </Form>
            )}
        </Formik>
    )
}

export default BreathingEditor;