import React, { useState } from "react";
import FormPage from "../components/Login/FormPage";
import SignupForm from "../components/Login/SignupForm";

/**
 * Signup page
 */
const SignupPage = () => {
    const [redirectSignup, setRedirectSignup] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState();
    const [registrationError, setRegistrationError] = useState();

    return (
        <FormPage
            success={registrationSuccess}
            error={registrationError}
            redirect={redirectSignup}
            redirectPath="/login"
        >
            <SignupForm 
                setRedirectSignup={setRedirectSignup} 
                setRegistrationSuccess={setRegistrationSuccess} 
                setRegistrationError={setRegistrationError} 
            />
        </FormPage>
    )
}
export default SignupPage;