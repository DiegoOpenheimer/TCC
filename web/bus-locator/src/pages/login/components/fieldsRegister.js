import React, { useState } from 'react'
import { TextField, Grid, Button } from '@material-ui/core'
import InputMask from 'react-input-mask'
import createStyle from '../styles'

const FieldsRegister = ({ onClick }) => {
    const classes = createStyle()
    const [ user, setUser ] = useState({
        email: '',
        cpf: '',
        password: '',
        confirmPassword: ''
    })
    const handleInput = target => event => {
        setUser({ ...user, [target]: event.target.value })
    }
    const verifyUser = () => {
        if (user) {
            const { email, cpf, password, confirmPassword } = user
            if (email && cpf && password && confirmPassword) {
                return false
            }
            return true
        }
        return true
    }
    return (
        <>
        <Grid container direction="column" >
            <TextField
                onChange={handleInput('email')}
                label="Email"
                margin="normal"
                variant="outlined"
                className={classes.textFields}
                placeholder="Informe email"
                />
            <InputMask mask="999.999.999-99" onChange={handleInput('cpf')}>
                {
                    props => <TextField
                        {...props}
                        label="Cpf"
                        margin="normal"
                        variant="outlined"
                        className={classes.textFields}
                    />
                }
            </InputMask>
            <TextField
                onChange={handleInput('password')}
                label="Senha"
                margin="normal"
                variant="outlined"
                type="password"
                className={classes.textFields}
                placeholder="Informe senha"
            />
            <TextField
                onChange={handleInput('confirmPassword')}
                label="Confirme senha"
                margin="normal"
                variant="outlined"
                type="password"
                className={classes.textFields}
                placeholder="Informe senha"
            />
            <Button onClick={() => onClick(user)} disabled={verifyUser()} variant="contained" color="primary">
                Entrar
            </Button>
        </Grid>
    </>
    )

}


export default FieldsRegister