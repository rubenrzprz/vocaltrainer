import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Alert that informs the user of actions performed in the page
 */
const Alert = (props) => {

  /**
   * Handles the closure of the alert
   * @param {*} event 
   * @param {*} reason 
   */
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setAlert({isOpen: false});
  };

  const action = (
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
  );

  return (
      <Snackbar
        open={props.alert.isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message={props.alert.message}
        action={action}
      />
  );
}

export default Alert;