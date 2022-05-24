import React, { useState } from 'react'
import FormPage from '../components/Login/FormPage';
import LoginForm from '../components/Login/LoginForm';

/**
 * Login page
 */
const LoginPage = () => {
    const [redirectLogin, setRedirectLogin] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState();
    const [loginError, setLoginError] = useState();

    return (
        <FormPage
            success={loginSuccess}
            error={loginError}
            redirect={redirectLogin}
            redirectPath="/dashboard"
        >
            <LoginForm 
                setRedirectLogin={setRedirectLogin} 
                setLoginSuccess={setLoginSuccess} 
                setLoginError={setLoginError} 
            />
        </FormPage>
    )
}

export default LoginPage;