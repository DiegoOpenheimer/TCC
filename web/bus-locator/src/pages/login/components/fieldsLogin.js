import React, { useState, useEffect } from 'react'
import { TextField, Grid, Button } from '@material-ui/core'
import createStyle from '../styles'

const FieldsLogin = ({ onClick, onClickRecoverPassword }) => {

    useEffect(() => {
        const callback = e => {
            if (e.key === 'Enter' && !verifyUser()) {
                onClick(user)
            }
        }
        document.addEventListener('keypress', callback)
        return () => document.removeEventListener('keypress', callback)
    })

    const classes = createStyle()
    const [ user, setUser ] = useState({
        email: '',
        password: ''
    })
    const handleInput = target => event => {
        setUser({ ...user, [target]: event.target.value })
        if (!verifyUser() && event.keyCode === 13) {
            onClick(user)
        }
    }
    const verifyUser = _ => {
        if (user.email && user.password) {
            return false
        }
        return true
    }
    return (
        <>
            <Grid className={classes.content} container direction="column" >
                <TextField
                    onChange={handleInput('email')}
                    label="Email"
                    margin="normal"
                    className={classes.textFields}
                    placeholder="Informe email"
                    />
                <TextField
                    onChange={handleInput('password')}
                    className={classes.textFields}
                    label="Senha"
                    margin="normal"
                    type="password"
                    placeholder="Informe senha"
                />
                <Grid container justify="space-between">
                    <Button onClick={_ => onClick(user)} disabled={verifyUser()} variant="contained" color="primary">
                        Entrar
                    </Button>
                    <Button onClick={onClickRecoverPassword} color="primary">
                        Esqueceu a senha?
                    </Button>
                </Grid>
            </Grid>
        </>
    )

}


export default FieldsLogin