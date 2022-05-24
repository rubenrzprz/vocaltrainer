import { Container, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { setInstrument, setRange } from "../../store/reducers/melodyReducer";
import SelectInstrument from "./SelectInstrument";
import SelectRange from "./SelectRange";

/**
 * Tool navbar for recording melodies
 */
const Navbar = ({instrumentList, instrument, range}) => {
    const dispatch = useDispatch();

    /**
     * Changes the instrument selected
     * @param {*} event 
     */
    const changeInstrument = (event) => {
        dispatch(setInstrument(event.target.value))
    }
    /**
     * Changes the range selected
     * @param {*} range 
     */
    const changeRange = (range) => {
        dispatch(setRange(range))
    }
    return (
        <Grid container>
            <Grid item>
                <SelectInstrument instrumentList={instrumentList} setInstrument={changeInstrument} instrument={instrument} />
            </Grid>
            <Grid item xs={12}>
                <Container>
                    <SelectRange setRange={changeRange} range={range} />
                </Container>
            </Grid>
        </Grid>
    );
}

export default Navbar;