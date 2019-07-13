import React from 'react'
import createStyle from '../../../style/global'
import createStyleLocal from '../style'
import MenuIcon from '@material-ui/icons/Menu'
import { AppBar, Toolbar, IconButton, Typography, Icon } from '@material-ui/core'
import { EMPLOYEE_ROLE } from '../../../utils/constants'
import storage from '../../../services/storage'

const CustomAppBar = props => {

    const user = storage.getUser()
    const classes = createStyle()
    const classesLocal = createStyleLocal()

    return (
        <AppBar className={classesLocal.appBar}>
            <Toolbar className={classesLocal.toolbar}>
                <IconButton
                    edge="start"
                    className={classes.menuButton}
                    aria-label="Open drawer"
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classesLocal.title}>
                    Painel de controle
                </Typography>
                {   (user && user.role === EMPLOYEE_ROLE.ADMIN) &&
                    <IconButton>
                        <Icon>
                            notifications
                        </Icon>
                    </IconButton>
                }
                <IconButton onClick={props.handleClose}>
                    <Icon>
                        exit_to_app
                    </Icon>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default CustomAppBar