import React, { useState } from 'react'
import { TextField, Grid, Button } from '@material-ui/core'
import InputMask from 'react-input-mask'
import createStyle from '../styles'

const FieldsRegister = ({ onClick }) => {
    const classes = createStyle()
    const [ user, setUser ] = useState({
        name: '',
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
            const { email, cpf, password, confirmPassword, name } = user
            if (email && cpf && password && confirmPassword && name) {
                return false
            }
            return true
        }
        return true
    }
    return (
        <>
        <Grid className={classes.content} container direction="column" >
            <TextField
                onChange={handleInput('name')}
                label="Nome"
                margin="normal"
                className={classes.textFields}
                placeholder="Informe email"
                />
            <TextField
                onChange={handleInput('email')}
                label="Email"
                margin="normal"
                className={classes.textFields}
                placeholder="Informe email"
                />
            <InputMask mask="999.999.999-99" onChange={handleInput('cpf')}>
                {
                    props => <TextField
                        {...props}
                        label="Cpf"
                        margin="normal"
                        className={classes.textFields}
                    />
                }
            </InputMask>
            <TextField
                onChange={handleInput('password')}
                label="Senha"
                margin="normal"
                type="password"
                className={classes.textFields}
                placeholder="Informe senha"
            />
            <TextField
                onChange={handleInput('confirmPassword')}
                label="Confirme senha"
                margin="normal"
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