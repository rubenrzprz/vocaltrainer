import { Alert, Paper } from "@mui/material";
import { Navigate } from "react-router-dom";

/**
 * Generic form page that displays errors and success as alerts
 */
const FormPage = ({success, error, redirect, redirectPath, children}) => {
    return (
        <>
            {success &&
                <Alert severity="success">{success}</Alert>
            }
            {error &&
                <Alert severity="error">{error}</Alert>
            }
            <Paper variant="outlined">
                {redirect && <Navigate replace to={redirectPath} />}
                {children}
            </Paper>
        </>
    )
}
export default FormPage;