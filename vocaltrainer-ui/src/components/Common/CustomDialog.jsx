import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogContentText} from '@mui/material';

/**
 * Dialog with custom content
 */
const CustomDialog = ({open, title, contentText, children , setOpen}) => {
    /**
     * Handles the closure of the dialog
     */
    const handleClose = () => {
        setOpen(false);
    }
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {contentText}
                </DialogContentText>
                {children}      
            </DialogContent>
        </Dialog>
    )
}

export default CustomDialog;