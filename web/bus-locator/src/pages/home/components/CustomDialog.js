import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Grid, Typography, makeStyles, Checkbox } from '@material-ui/core'

const createStyle = makeStyles({
    field: {
        flex: 1
    },
    information: {
        flex: 3
    },
    checkBox: {
        paddingLeft: 0,
        '&:hover': {
            backgroundColor: 'transparent !important'
        }
    }
})

const CustomDialog = props => {

    const styles = createStyle()
    const [ value, setValue ] = useState(false)

    let { user } = props
    if (!user) {
        user = { name: '', email: '', cpf: '' }
    }

    useEffect(() => {
        if (!props.open) {
            setValue(false)
        }
    }, [ props.open ])

    function requestServer() {
        const body = { ...user }
        if (value) {
            body.admin = value
        }
        console.log(body)
    }

    return (
        <Dialog
            open={props.open}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">Atenção</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Deseja aprovar a entrada desse usuário no sistema?
                </DialogContentText>
                <Grid container direction="row" wrap="nowrap">
                    <Grid container className={styles.field}  ><Typography>Nome: </Typography></Grid>
                    <Grid container className={styles.information} ><Typography >{ user.name }</Typography></Grid>
                </Grid>
                <Grid container direction="row" wrap="nowrap" >
                    <Grid container className={styles.field} ><Typography>Cpf: </Typography></Grid>
                    <Grid container className={styles.information} ><Typography >{ user.cpf }</Typography></Grid>
                </Grid>
                <Grid container direction="row" wrap="nowrap" >
                    <Grid container className={styles.field} ><Typography>Email: </Typography></Grid>
                    <Grid container className={styles.information} >
                        <Typography >{ user.email }</Typography>
                    </Grid>
                </Grid>
                <Grid container direction="row" wrap="nowrap" alignItems="center" >
                    <Grid>
                        <Checkbox checked={value} onChange={event => setValue(event.target.checked)} className={styles.checkBox} />
                    </Grid>
                    <Grid>
                        <Typography >Aprovar usuário como admin?</Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.negativeAction} color="primary">
                    Não
                </Button>
                <Button onClick={requestServer} color="primary">
                    Sim
                </Button>
            </DialogActions>
        </Dialog>
    )


}

export default CustomDialog