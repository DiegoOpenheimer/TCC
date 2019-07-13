import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Slide } from '@material-ui/core'

const TransitionSlide = React.forwardRef(function(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
})

const CustomDialog = props => {

    const buildTransition = () => {
        if (props.transition && props.transition === 'Slide') {
            return TransitionSlide
        }
    }

    return (
        <Dialog
            open={props.open}
            TransitionComponent={buildTransition()}
            keepMounted
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {props.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.negativeAction} color="primary">
                    { props.negativeButton }
                </Button>
                <Button onClick={props.positiveAction} color="primary">
                    { props.positiveButton }
                </Button>
            </DialogActions>
        </Dialog>
    )


}

export default CustomDialog