import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import createStyle from '../../style/global'
import Dialog from '../../components/dialog'
import AppBar from './components/AppBar'
import CustomDialog from './components/CustomDialog'
import Card from './components/Card'
import createStyleLocal from './style'
import { requestTotalUsers, requestEmployeeToEnable } from '../../redux/home/actions'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { Redirect } from 'react-router-dom'
import storage from '../../services/storage'

const Home = props => {
    const { isLoadingTotalUsers, totalUsers, requestTotalUsers, errorLoadTotalUsers, requestEmployeeToEnable, usersNotAuthorized } = props
    const classes = createStyle()
    const classesLocal = createStyleLocal()
    const [ open, setOpen ] = useState(false)
    const [ openCustomDialog, setOpenCustomDialog ] = useState(false)
    const [ redirect, setRedirect ] = useState(false)
    const [ user, setUser ] = useState(null)
    const handleClose = () => setOpen(!open)
    const handleCloseCustomDialog = () => setOpenCustomDialog(!openCustomDialog)
    const logout = () => {
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
                if (show) {
                    toast.error('Erro de comunicação com servidor, verique sua conexão')
                }
                show = false
            }
            requestTotalUsers(callback)
            requestEmployeeToEnable(callback)
            
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])

    if (redirect) {
        return <Redirect to="/login"/>
    }

    return (
        <>
            <Grid className={classes.maxContainer} container item direction="column" wrap="nowrap" alignItems="center">
                <AppBar handleClose={handleClose} usersNotAuthorized={usersNotAuthorized} onSelectedUser={handleUserToAprrove} />
                <Dialog
                    transition="Slide"
                    title="Atenção"
                    open={open}
                    onClose={handleClose}
                    message="Deseja sair da aplicaçao?"
                    negativeButton="Não"
                    positiveButton="Sim"
                    negativeAction={handleClose}
                    positiveAction={logout}/>
                <CustomDialog
                    user={user}
                    open={openCustomDialog}
                    negativeAction={handleCloseCustomDialog}
                />

                <Grid item container className={classesLocal.content}>
                    <Card buttonError={() => requestTotalUsers()} error={errorLoadTotalUsers} isLoading={isLoadingTotalUsers} icon="people_outline" title="Total de usuários" content={totalUsers} />
                </Grid>
            </Grid>
            <Redirect from="*" to="/home" />
        </>
    )
}

const mapStateToProps = state => {
    return {
        isLoadingTotalUsers: state.home.isLoadingTotalUsers,
        totalUsers: state.home.totalUsers,
        errorLoadTotalUsers: state.home.errorLoadTotalUsers,
        usersNotAuthorized: state.home.usersNotAuthorized
    }
}

export default connect(mapStateToProps, { requestTotalUsers, requestEmployeeToEnable })(Home)