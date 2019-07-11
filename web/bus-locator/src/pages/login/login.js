import React, { useState } from 'react'
import { Grid, Tabs, Tab, useTheme } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import createStyle from './styles'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Route } from 'react-router-dom'

import FieldsLogin from './components/fieldsLogin'
import FieldsRegister from './components/fieldsRegister'
import ForgotPassword from './components/forgotPassword'

const Login = props => {
    console.log(props)
    const [ state, setState ] = useState(0)
    const handleChange = (_, newValue) => setState(newValue)
    const classes = createStyle()
    const theme = useTheme()

    function handleChangeIndex(index) {
        setState(index);
    }

    const registerUser = user => {
        if (user.password !== user.confirmPassword) {
            toast.error('Senhas diferentes', { position: toast.POSITION.TOP_LEFT })
        } else {
            console.log('request server to save')
        }
    }

    const requestLogin = console.log
    
    return (
        <Grid container className={classes.root} wrap="nowrap">

            <Grid container justify="center" alignItems="center" item className={classes.contentLogo}>
                <h1>Bus Locator</h1>
            </Grid>


            <Grid item container direction="column" justify="space-evenly" alignItems="center" className={classes.fields} >
                <Route path={props.match.url} exact render={() => {
                    return (
                    <Grid item container direction="column" justify="center" style={{width: 400}}>
                        <Tabs
                        className={classes.tabs}
                        variant="fullWidth"
                        value={state}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                            >
                            <Tab className={classes.textTab} label="Entrar" />
                            <Tab className={classes.textTab} label="Nova Conta" />
                        </Tabs>
                        <h2 className={classes.textPresent}>Bem vindo ao Bus locator</h2>
                        <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={state}
                        onChangeIndex={handleChangeIndex}>
                            <FieldsLogin onClick={requestLogin} onClickRecoverPassword={() => props.history.push('/login/forgot-password')} />
                            <FieldsRegister onClick={registerUser} />
                        </SwipeableViews>
                    </Grid>
                    )
                }}/>

                <Route path={props.match.url + '/forgot-password'} exact component={ForgotPassword} />
            </Grid>
        </Grid>
    )

}

export default Login