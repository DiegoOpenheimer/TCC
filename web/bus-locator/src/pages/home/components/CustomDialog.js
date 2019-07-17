import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Grid, Typography, makeStyles, Checkbox, CircularProgress } from '@material-ui/core'
import { EMPLOYEE_ROLE, USER_STATUS } from '../../../utils/constants'
import network from '../../../services/network'

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
    const [ loading, setLoading ] = useState(false)

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
        const body = {
            name: user.name,
            cpf: user.cpf,
            status: USER_STATUS.ENABLED,
            email: user.email
        }
        if (value) {
            body.role = EMPLOYEE_ROLE.ADMIN
        } else {
            body.role = EMPLOYEE_ROLE.COMMON
        }
        const callback = cb => {
            cb()
            setLoading(false)
        }
        setLoading(true)
        network.patch('employee/edit', body)
        .then(() => callback(props.success))
        .catch(e => callback(props.error))
    }

    function handleLoading() {
        if (loading) {
            return <CircularProgress/>
        } else {
            return (
            <Button onClick={requestServer} color="primary">
                Sim
            </Button>
            )
        }
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
                        <Checkbox color="primary" checked={value} onChange={event => setValue(event.target.checked)} className={styles.checkBox} />
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
                { handleLoading() }
            </DialogActions>
        </Dialog>
    )


}

export default CustomDialog