import React, { useState, useEffect } from 'react'
import { Paper, Grid, TextField, Button, Typography, Divider, makeStyles } from '@material-ui/core'
import InputMask from 'react-input-mask'
import {toast} from 'react-toastify'
import network from '../../services/network'
import { useDispatch } from 'react-redux'
import { updateLoading } from '../../redux/components/action'
import { handleUser } from '../../redux/home/actions'

const styles = makeStyles({
    contentPadding: {
        padding: 32,
    },
    content: {
        width: '70%'
    },
    contentButton: {
        margin: '16px 32px'
    }
})

function Account(props) {

    useEffect(() => {
        network.get('employee/current')
        .then(({data}) => setUser(data))
        .catch(e => toast.error('Falha de comunicação com o servidor'))
    }, [  ])
    const dispatch = useDispatch()
    const classes = styles()
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

    function editUser() {
        if (user.password !== user.confirmPassword) {
            toast.error('Senhas diferentes')
        } else {
            dispatch(updateLoading(true))
            network.patch('employee/edit', user)
            .then(({data}) => {
                dispatch(updateLoading(false))
                dispatch(handleUser(data.user))
                toast.success('Conta editada com sucesso')
            })
            .catch(e => {
                dispatch(updateLoading(false))
                toast.error('Falha editar conta')
            })
        }
    }

    return (
        <Grid container justify="center" alignItems="center">
            <Paper className={classes.content}>
                <Grid container direction="column">
                    <Grid className={classes.contentPadding}>
                        <Typography variant="h5">Perfil</Typography>
                        <Typography variant="h6">As informações podem ser editadas</Typography>
                    </Grid>
                    <Divider />
                    <Grid className={classes.contentPadding} container direction="column">
                        <TextField
                            onChange={handleInput('name')}
                            label="Nome"
                            margin="normal"
                            placeholder="Informe email"
                            variant="outlined"
                            value={user.name}
                            />
                        <TextField
                            label="Email"
                            margin="normal"
                            placeholder="Informe email"
                            variant="outlined"
                            value={user.email}
                            disabled
                            />
                        <InputMask mask="999.999.999-99" value={user.cpf} onChange={handleInput('cpf')}>
                            {
                                props => <TextField
                                    {...props}
                                    label="Cpf"
                                    margin="normal"
                                    variant="outlined"
                                />
                            }
                        </InputMask>
                        <TextField
                            onChange={handleInput('password')}
                            label="Senha"
                            margin="normal"
                            type="password"
                            placeholder="Informe senha"
                            variant="outlined"
                        />
                        <TextField
                            onChange={handleInput('confirmPassword')}
                            label="Confirme senha"
                            margin="normal"
                            type="password"
                            placeholder="Informe senha"
                            variant="outlined"
                            
                        />
                    </Grid>
                    <Divider />
                    <Grid className={classes.contentButton}>
                        <Button onClick={editUser} disabled={verifyUser()} variant="contained" color="primary">
                            Salvar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )

}

export default Account