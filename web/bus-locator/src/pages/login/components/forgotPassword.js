import React, { useState } from 'react'
import { Grid, TextField, Button } from '@material-ui/core'
import createStyle from '../styles'

const ForgotPassword = props => {
    const classes = createStyle()
    const [ email, setEmail ] = useState('')
    return (
        <Grid item container direction="column" justify="flex-start" className={classes.contentForgotPassword}>
            <h2 className={classes.textPresent}>Recuperar senha:</h2>
            <TextField
                className={classes.textFields}
                label="Email"
                margin="normal"
                variant="outlined"
                placeholder="Informe email"
                onChange={ev => setEmail(ev.target.value)}
            />
            <Button disabled={!email} className={classes.addMarginBottom} variant="contained" color="primary" onClick={() => props.recoverPassword(email)}>Enviar</Button>
            <Button onClick={props.goBack}>Voltar</Button>
        </Grid>
    )
}

export default ForgotPassword