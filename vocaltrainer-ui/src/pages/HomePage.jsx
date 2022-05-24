import { Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { isLogged } from "../store/reducers/authReducer";

/**
 * Home page
 */
const HomePage = () => {
    const isLoggedIn = useSelector(isLogged);
    return (
            <Grid 
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            marginTop={4}
            spacing={2}
            >
                <Grid item>
                    <img src="/logo.png" alt="Vocal Trainer Logo" width={400}/>
                    </Grid>
                <Grid item>
                    <Typography variant="h5">
                        A website for creating and playing singing exercises!
                    </Typography>
                </Grid>
                <Grid item>
                <Typography variant="h6">
                    {isLoggedIn ? 
                      <Link to="/record">Record a melody now!</Link>
                    : <span><Link to="/signup">Sign up</Link> and start improving your vocals today!</span>
                    }
                </Typography>
                </Grid>
            </Grid>
    )
}
export default HomePage;