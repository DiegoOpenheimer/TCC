import React from 'react'
import { Grid, TextField, Button } from '@material-ui/core'
import createStyle from '../styles'

const ForgotPassword = props => {
    const classes = createStyle()
    return (
        <Grid item container direction="column" justify="flex-start" className={classes.contentForgotPassword}>
            <h2 className={classes.textPresent}>Recuperar senha:</h2>
            <TextField
                className={classes.textFields}
                label="Email"
                margin="normal"
                variant="outlined"
                type="password"
                placeholder="Informe email"
            />
            <Button onClick={props.history.goBack}>Voltar</Button>
        </Grid>
    )
}

export default ForgotPassword