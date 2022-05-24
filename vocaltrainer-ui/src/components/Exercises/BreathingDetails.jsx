import { Grid, Paper, TableBody, Typography } from "@mui/material";
import { Table, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

/**
 * Displays the data of a breathing exercise in a table
 */
const BreathingDetails = ({ name, description, exercise }) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h5">Name: {name}</Typography>
                <Typography variant="p">Description: {description}</Typography>
            </Grid>
            <Grid item xs={12} container justifyContent="center">
                <Grid item>
                    <TableContainer component={Paper}>
                        <Table sx={{ width: "max-content" }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{fontWeight: 'bold'}}>Position</TableCell>
                                    <TableCell align="center" sx={{fontWeight: 'bold'}}>Inhale time (s)</TableCell>
                                    <TableCell align="center" sx={{fontWeight: 'bold'}}>Hold time (s)</TableCell>
                                    <TableCell align="center" sx={{fontWeight: 'bold'}}>Exhale time (s)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exercise?.map((fragment) => (
                                    <TableRow
                                        key={fragment.position}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" sx={{fontWeight: 'bold'}}>
                                            #{fragment.position}
                                        </TableCell>
                                        <TableCell align="right">{fragment.inhaleTime}</TableCell>
                                        <TableCell align="right">{fragment.holdTime}</TableCell>
                                        <TableCell align="right">{fragment.exhaleTime}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default BreathingDetails;