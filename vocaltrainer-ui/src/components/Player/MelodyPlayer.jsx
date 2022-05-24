import { Button, Grid } from "@mui/material";
import Keyboard from "../Keyboard/Keyboard";
import { Children } from "react";

const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Wraps the functionallity for playing a melody
 */
const MelodyPlayer = ({
    onClickPlay,
    onClickStop,
    styles,
    children,
    disabled,
    ...keyboardProps }
) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} style={styles}>
                <Keyboard
                    {...keyboardProps}
                    soundfontHostname={soundfontHostname}
                    audioContext={audioContext}
                />
            </Grid>
            <Grid item xs={12} container justifyContent="center" spacing={2}>
                <Grid item>
                    <Button variant="contained" onClick={onClickPlay} disabled={disabled}>Play</Button>
                </Grid>
                {onClickStop &&
                    <Grid item>
                        <Button variant="contained" onClick={onClickStop} disabled={disabled}>Stop</Button>
                    </Grid>
                }
                {children &&
                    Children.map(children, (child) => (
                        <Grid item>
                            {child}
                        </Grid>
                    ))
                }
            </Grid>
        </Grid>
    )
}

export default MelodyPlayer;