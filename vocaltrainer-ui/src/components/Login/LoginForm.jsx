import React, { useEffect } from 'react'
import Button from '@mui/material/Button';
import { Grid, Typography } from '@mui/material';
import * as Yup from 'yup';
import { emailRegex } from './validation';
import { Link } from 'react-router-dom';
import { login, isLogged } from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';

/**
 * Schema for form validation
 */
const schema = Yup.object().shape({
    email: Yup.string().required('Email is required').matches(emailRegex, 'Email address is not valid'),
    password: Yup.string().required('Password is required')
});

const initialValues = {
    email: '',
    password: ''
}

/**
 * Form for logging into the app
 */
const LoginForm = (props) => {
    const dispatch = useDispatch();
    const loginStatus = useSelector(isLogged)
    const error = useSelector(state => state.user.auth.error);
    const message = useSelector(state => state.user.auth.user?.message)

    /**
     * Submits the login to the server
     * @param {*} credentials 
     */
    const onSubmit = (credentials) => {
        dispatch(login(credentials));
    }

    /**
     * Sets the messages of error/success and redirects if success
     */
    useEffect(() => {
        if (loginStatus) {
            props.setLoginSuccess(message);
            props.setLoginError(null);
            setTimeout(() => {
                props.setRedirectLogin(true)
            }, 800);
        } else if (error) {
            props.setLoginError(error);
            props.setLoginSuccess(null);
        }
    }, [loginStatus, error, message, props])

    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={schema}>
            <Form autoComplete='on'>
                <Grid container
                    spacing={3}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    marginY={10}
                    paddingBottom={3}
                >
                    <Grid item xs={12}>
                        <Typography textAlign="center" variant="h2">Log in</Typography>
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
                        <Button variant="contained" type="submit">Log In</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <span>Not registered yet? <Link to="/signup">Sign up</Link></span>
                    </Grid>
                </Grid>
            </Form>
        </Formik>
    )
}

export default LoginForm;