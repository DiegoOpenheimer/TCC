import React, { useState } from 'react'
import { Grid, Tabs, Tab, useTheme, LinearProgress } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import createStyle from './styles'
import { toast } from 'react-toastify'
import { Route } from 'react-router-dom'
import FieldsLogin from './components/fieldsLogin'
import FieldsRegister from './components/fieldsRegister'
import ForgotPassword from './components/forgotPassword'
import { connect } from 'react-redux'
import { requestLogin, createAccount, recoverPassword } from '../../redux/login/actions'

const Login = props => {
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
            props.createAccount(
                user,
                () => toast.success('Conta criada com sucesso, confirme no seu email'),
                e => toast.error(e)
            )
        }
    }
    
    const requestLogin = user => {
        props.requestLogin(user, () => {
            toast.success('Login efetuado com sucess')
            props.history.push('/home')
        }, e => toast.error(e))
    }

    const recoverPassword = email => {
        props.recoverPassword(email, () => toast.success('Verifique seu email'), e => toast.error(e))
    }

    return (
        <Grid container className={classes.root} wrap="nowrap">
            {
                props.isLoading &&
                <LinearProgress className={classes.linearProgress} />
            }
            <Grid container justify="center" alignItems="center" item className={classes.contentLogo}>
                <h1>Bus Locator</h1>
            </Grid>


            <Grid item container direction="column" justify="center" alignItems="center" className={classes.fields} >
                <Route path={props.match.url} exact render={() => {
                    return (
                    <Grid item container direction="column" alignItems="center" justify="center" style={{width: 320}}>
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

                <Route path={props.match.url + '/forgot-password'} exact render={() => <ForgotPassword goBack={props.history.goBack} recoverPassword={recoverPassword} />} />
            </Grid>
        </Grid>
    )

}

const mapStateToProps = state => {
    return {
        isLoading: state.login.isLoading,
    }
}

export default connect(mapStateToProps, { requestLogin, createAccount, recoverPassword })(Login)