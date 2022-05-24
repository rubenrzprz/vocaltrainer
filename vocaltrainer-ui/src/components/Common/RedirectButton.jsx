import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * Redirecting button with a text and route inherited by props
 */
const RedirectButton = (props) => {
    const navigate = useNavigate();
    const {path, text} = props;
    return (
        <Button variant="contained" onClick={() => navigate(path)}>{text}</Button>
    )
}

export default RedirectButton;