import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function(props) {
  return (
    <Dialog open={props.open} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">{ props.title }</DialogTitle>
    <DialogContent>
        <DialogContentText>
        { props.message }
        </DialogContentText>
        <TextField
          autoFocus
          onChange={ props.onChange }
          margin="dense"
          label={ props.label }
          fullWidth
          value={props.text}
        />
    </DialogContent>
    <DialogActions>
        <Button onClick={props.onCancel} color="primary">
            { props.textCancel }
        </Button>
        <Button onClick={props.onConfirm} color="primary">
            { props.textButton }
        </Button>
    </DialogActions>
    </Dialog>
  )
}
