import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import createStyle from '../../style/global'
import AppBar from './components/AppBar'
import Dialog from '../../components/dialog'

const Home = props => {

    const classes = createStyle()
    const [ open, setOpen ] = useState(false)

    const handleClose = () => setOpen(!open)


    const logout = () => {
        handleClose(!open)
        localStorage.removeItem('user')
        props.history.goBack()
    }

    // if (!navigator.online) {
    //     logout()
    // }
    console.log(navigator)

    return (
        <Grid className={classes.maxContainer} container item justify="center" direction="column" alignItems="center">
            <AppBar handleClose={handleClose} />
            <Dialog
                transition="Slide"
                title="Atenção"
                open={open}
                message="Deseja sair da aplicaçao?"
                negativeButton="Não"
                positiveButton="Sim"
                negativeAction={handleClose}
                positiveAction={logout}/>
        </Grid>
    )
}

export default Home