import React from 'react'
import Button from '@mui/material/Button';
import { publicFetch } from '../../utils/fetch';
import { Grid, Typography } from '@mui/material';
import { emailRegex } from './validation';
import * as Yup from 'yup';
import { TextField } from 'formik-mui';
import { Field, Formik, Form } from 'formik';

/**
 * Schema for the form validation
 */
const schema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().required('Email is required').matches(emailRegex, 'Email address is not valid'),
    password: Yup.string().required('Password is required')
});

const initialValues = {
    username: '',
    email: '',
    password: ''
}

const SignupForm = (props) => {

    /**
     * Submits the registration to the server
     * @param {*} credentials 
     */
    const onSubmit = async (credentials) => {
        try {
            const { data } = await publicFetch.post(
                'signup',
                credentials
            )
            props.setRegistrationSuccess(data.message);
            props.setRegistrationError(null);
            setTimeout(() => {
                props.setRedirectSignup(true)
            }, 800);
        } catch (error) {
            const { data } = error.response;
            props.setRegistrationError(data.message);
            props.setRegistrationSuccess(null);
        }
    }
    return (
        <Formik onSubmit={onSubmit} validationSchema={schema} initialValues={initialValues}>
            <Form>
                <Grid container
                    spacing={3}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    marginY={10}
                    paddingBottom={3}
                >
                    <Grid item xs={12}>
                        <Typography textAlign="center" variant="h2">Sign Up</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            name="username"
                            label="Username"
                            component={TextField}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            name="email"
                            label="Email"
                            component={TextField}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            name="password"
                            label="Password"
                            component={TextField}
                            type="password"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" type="submit">Sign up</Button>
                    </Grid>
                </Grid>
            </Form>
        </Formik>
    )
}

export default SignupForm;