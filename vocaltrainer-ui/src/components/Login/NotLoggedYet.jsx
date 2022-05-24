import { Box, Grid, Paper, Typography } from "@mui/material";
import RedirectButton from "../Common/RedirectButton";

/**
 * Page to show when the user tries to access a restricted page without logging in
 */
const NotLoggedYet = () => {
    return (
        <Paper>
            <Grid container
                spacing={3}
                direction="column"
                justify="center"
                alignItems="center"
                marginY={10}
                paddingBottom={3}
            >
                <Grid item>
                    <Typography variant="h5">You need to log in to access this page</Typography>
                </Grid>
                <Grid item>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        padding: 2
                    }}>
                        <RedirectButton path="/login" text="Log In"/>
                        <p>or</p>
                        <RedirectButton path="/" text="Go to Home Page"/>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    )
}
export default NotLoggedYet;