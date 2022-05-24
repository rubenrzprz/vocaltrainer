import { AccordionDetails, AccordionSummary, Grid, Accordion, Typography } from "@mui/material";
import React from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Show the diffrent patterns inside a table like grid
 */
const PatternInfo = ({ patterns }) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography variant="h5">Pattern descriptions</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container gap={2}>
                    {patterns.map(pattern => (
                        <React.Fragment key={pattern.value}>
                            <Grid item xs={1}>
                                {pattern.label}
                            </Grid>
                            <Grid item xs={10}>
                                {pattern.description}
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}

export default PatternInfo;