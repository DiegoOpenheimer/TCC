import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import createStyle from '../../style/global'
import Dialog from '../../components/dialog'
import AppBar from '../../components/AppBar'
import CustomDialog from '../../components/CustomDialog'
import createStyleLocal from './style'
import { requestEmployeeToEnable, requestUser, logout } from '../../redux/home/actions'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { Redirect, Route, Switch } from 'react-router-dom'
import storage from '../../services/storage'
import clsx from 'clsx'
import { ROUTES } from '../../utils/constants'
import Employee from '../employess/employees'
import Account from '../account/account'
import History from '../history/history'
import Maps from '../maps/maps'
import Suggestion from '../suggestion/suggestion'
import Devices from '../devices/devices'
import Lines from '../lines/lines'
import News from '../news/news'
import Loading from '../../components/loading'
import Dashboard from './components/Dashboard'
import Auth from '../auth/auth'

const Home = props => {
    const {
        requestEmployeeToEnable,
        usersNotAuthorized,
        requestUser,
        logout } = props
    const classes = createStyle()
    const classesLocal = createStyleLocal()
    const [ open, setOpen ] = useState(false)
    const [ openCustomDialog, setOpenCustomDialog ] = useState(false)
    const [ redirect, setRedirect ] = useState(false)
    const [ user, setUser ] = useState(null)
    const [ openDrawer, onDrawer ] = useState(false)
    const handleClose = () => setOpen(!open)
    const handleCloseCustomDialog = () => setOpenCustomDialog(!openCustomDialog)
    const handleLogout = () => {
        logout()
        handleClose(!open)
        storage.removeUser()
        setRedirect(true)
    }

    const handleUserToAprrove = user => {
        setUser(user)
        handleCloseCustomDialog()
    }
    useEffect(() => {
        if (!storage.getUser()) {
            setRedirect(true)
        } else {
            let show = true
            const callback = () => {
                if (show && props.location.pathname === ROUTES.HOME) {
                    toast.error('Erro de comunicação com servidor, verique sua conexão')
                }
                show = false
            }
            requestEmployeeToEnable(callback)
            requestUser(callback)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [ props.location ])

    if (redirect) {
        return <Redirect to={ROUTES.LOGIN}/>
    } 
    return (
        <Auth onlyToken>
            <Grid className={classes.maxContainer} container item direction="column" wrap="nowrap" alignItems="center">
                <Loading />
                <AppBar onDrawer={onDrawer} handleClose={handleClose} usersNotAuthorized={usersNotAuthorized} onSelectedUser={handleUserToAprrove} />
                <Dialog
                    transition="Slide"
                    title="Atenção"
                    open={open}
                    onClose={handleClose}
                    message="Deseja sair da aplicaçao?"
                    negativeButton="Não"
                    positiveButton="Sim"
                    negativeAction={handleClose}
                    positiveAction={handleLogout}/>
                <CustomDialog
                    message="Deseja aprovar a entrada desse usuário no sistema?"
                    messageCheckBox="Aprovar usuário como admin?"
                    success={() => {
                        setOpenCustomDialog(false)
                        requestEmployeeToEnable()
                        toast.success('Usuário aprovado com sucesso')
                    }}
                    error={() => {
                        setOpenCustomDialog(false)
                        toast.error('Falha ao aprovar usuário no sistema')
                    }}
                    user={user}
                    open={openCustomDialog}
                    negativeAction={handleCloseCustomDialog}
                />

                <Grid item container className={clsx(classesLocal.content, { [classesLocal.contentShift]: openDrawer })}>
                    <Switch>
                        <Route exact path={ROUTES.HOME} component={Dashboard} />
                        <Route exact path={ROUTES.MAP} component={Maps} />
                        <Route path={ROUTES.EMPLOYEES} component={Employee} />
                        <Route path={ROUTES.ACCOUNT} component={Account} />
                        <Route path={ROUTES.HISTORY} component={History} />
                        <Route path={ROUTES.SUGGESTION} component={Suggestion} />
                        <Route path={ROUTES.DEVICES} component={Devices} />
                        <Route path={ROUTES.LINES} component={Lines} />
                        <Route path={ROUTES.NEWS} component={News} />
                        <Redirect from="*" to={ROUTES.HOME} />
                    </Switch>
                </Grid>
            </Grid>
        </Auth>
    )
}

const mapStateToProps = state => {
    return {
        usersNotAuthorized: state.home.usersNotAuthorized,
        user: state.home.user
    }
}

export default connect(mapStateToProps, { requestEmployeeToEnable, requestUser, logout })(Home)