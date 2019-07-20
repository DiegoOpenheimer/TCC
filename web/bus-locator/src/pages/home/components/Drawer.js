import React from 'react'
import { Drawer, Grid, makeStyles, Divider, Typography, List, ListItemIcon, ListItemText, ListItem }  from '@material-ui/core'
import createStyle from '../style'
import { Dashboard, People, AccountBox } from '@material-ui/icons'
import clsx from 'clsx'
import { withRouter } from 'react-router-dom'
import { ROUTES } from '../../../utils/constants'
import { useSelector } from 'react-redux'

const styles = makeStyles({
    header: {
        height: 200,
    },
    listItem: {
        cursor: 'pointer',
        margin: '8px 0px',
        borderLeft: '4px solid transparent',
        '&:hover': {
            borderLeft: '4px solid #0767DB',
            borderRadius: 4,
            backgroundColor: '#F6F9FD',
            color: '#0767DB !important'
        },
        '&:hover $icon': {
            color: '#0767DB !important'
        }
    },
    activeRoute: {
        borderLeft: '4px solid #0767DB',
        borderRadius: 4,
        backgroundColor: '#F6F9FD'
    },
    listItemText: {
        fontWeight: 500,
        color: '#66788A',
        marginLeft: 8,
    },
    listItemActive: {
        color: '#12161B'
    },
    iconActive: {
        color: '#0767DB !important'
    },
    icon: {
        minWidth: 'unset !important',
        fontWeight: 500,
        color: '#66788A',
    },
    list: {
        paddingLeft: 8
    }
})

const CustomDrawer = props => {

    const user = useSelector(state => state.home.user)
    const { onClose, open, location: { pathname } } = props
    const classesLocal = createStyle()
    const classes = styles()
    const items = [
        {
            icon: <Dashboard/>,
            text: 'Painel de controle',
            url: ROUTES.HOME,
            isActive: pathname === ROUTES.HOME,
            onClick() { pathname !== ROUTES.HOME && handleRoute(ROUTES.HOME) }
        },
        {
            icon: <AccountBox/>,
            text: 'Minha Conta',
            url: ROUTES.ACCOUNT,
            isActive: pathname === ROUTES.ACCOUNT,
            onClick() { pathname !== ROUTES.ACCOUNT && handleRoute(ROUTES.ACCOUNT) }
        },
        {
            icon: <People/>,
            text: 'Funcionários',
            url: ROUTES.EMPLOYEES,
            isActive: pathname === ROUTES.EMPLOYEES,
            onClick() { pathname !== ROUTES.EMPLOYEES && handleRoute(ROUTES.EMPLOYEES) }
        },
    ]
    function handleRoute(route) {
        props.history.push(route)
    }

    function buildListItem() {
        return items.map((item, index) => {
            return (
            <ListItem key={index.toString()} onClick={item.onClick} className={clsx(classes.listItem, { [classes.activeRoute]: item.isActive })} >
                <ListItemIcon className={clsx(classes.icon, { [classes.iconActive]:item.isActive })}>
                   { item.icon }
                </ListItemIcon>
                <ListItemText className={clsx(classes.listItemText, { [classes.listItemActive]: item.isActive })}>
                   { item.text }
                </ListItemText>
            </ListItem>
            )
        })
    }

    return (
        <Drawer
            variant="persistent"
            onClose={onClose}
            className={classesLocal.drawer}
            anchor="left"
            open={open}
            classes={{
            paper: classesLocal.drawerPaper,
            }}
        >
            <Divider />
            <Grid container justify="center" direction="column" alignItems="center" className={classes.header} >
                <h1>Logo</h1>
                <Typography variant="h6" >{ user.name }</Typography>
                <span>{ user.email }</span>
            </Grid>
            <Divider />
            <List className={classes.list}>
                { buildListItem() }
            </List>
        </Drawer>
    )

}

export default withRouter(CustomDrawer)