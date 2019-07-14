import React, { useState } from 'react'
import createStyle from '../../../style/global'
import createStyleLocal from '../style'
import MenuIcon from '@material-ui/icons/Menu'
import { Notifications, ExitToApp, ChevronRight } from '@material-ui/icons'
import { AppBar, Toolbar, IconButton, Typography, Badge, Popover, Grid, List, ListItemText, ListItemSecondaryAction, ListItem, Divider, Drawer } from '@material-ui/core'
import { EMPLOYEE_ROLE } from '../../../utils/constants'
import storage from '../../../services/storage'

const CustomAppBar = props => {

    const user = storage.getUser()
    const classes = createStyle()
    const classesLocal = createStyleLocal()
    const [ open, setOpen ] = useState(false)
    const [ openDrawer, setDrawer ] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const size = props.usersNotAuthorized.length

    const handleClose = () => setOpen(!open)
    const handleDrawer = () => setDrawer(!openDrawer)

    function handleClick(event) {
        if (size) {
            if (!open) {
                setAnchorEl(event.currentTarget)
            } else {
                setAnchorEl(null)    
            }
            setOpen(!open)
        }
    }

    function verifyNotification() {
        if (size) {
            return (
                <Badge badgeContent={size} color="secondary">
                    <Notifications />
                </Badge>
            )
        }
        return <Notifications />
    }

    function buildItems() {
        return props.usersNotAuthorized.map(user => {
            return (
                <React.Fragment key={user._id}>
                    <ListItem onClick={() => {
                        handleClose()
                        props.onSelectedUser(user)
                    }} button className={classesLocal.content}>
                        <ListItemText primary={user.name} secondary={user.email} />
                        <ListItemSecondaryAction>
                            <ChevronRight />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                </React.Fragment>
            )
        })
    }

    return (
        <>
            <AppBar position="relative" className={classesLocal.appBar}>
                <Toolbar className={classesLocal.toolbar}>
                    <IconButton
                        onClick={handleDrawer}
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
                        <IconButton onClick={handleClick}>
                            { verifyNotification() }
                        </IconButton>
                    }
                    <IconButton onClick={props.handleClose}>
                        <ExitToApp />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
                }}
            >
                <Grid className={classesLocal.popoverHeader}>
                    <Typography variant="h5">
                        Solicitação de entrada
                    </Typography>
                </Grid>
                <Grid>
                    <List className={classesLocal.removePadding}>
                        { buildItems() }
                    </List>
                </Grid>
            </Popover>
            <Drawer
                onClose={handleDrawer}
                className={classesLocal.drawer}
                anchor="left"
                open={openDrawer}
                classes={{
                paper: classesLocal.drawerPaper,
                }}
            >
            <h1 onClick={handleDrawer}>ola</h1>
            </Drawer>
        </>
    )
}

export default CustomAppBar