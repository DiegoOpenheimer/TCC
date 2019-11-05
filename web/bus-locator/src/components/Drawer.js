import React from 'react'
import { Drawer, Grid, makeStyles, Divider, Typography, List, ListItemIcon, ListItemText, ListItem }  from '@material-ui/core'
import createStyle from '../pages/home/style'
import { Dashboard, People, AccountBox, History, QuestionAnswer, LocationOn, Directions, Map, Drafts } from '@material-ui/icons'
import clsx from 'clsx'
import { withRouter } from 'react-router-dom'
import { ROUTES, EMPLOYEE_ROLE } from '../utils/constants'
import { useSelector } from 'react-redux'
import LOGO from '../assets/logo.png'

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
    },
    img: {
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        height: '15vh'
    }
})

const CustomDrawer = props => {

    const user = useSelector(state => state.home.user)
    const { onClose, open, location: { pathname } } = props
    const classesLocal = createStyle()
    const classes = styles()
    const isAdmin = user.role === EMPLOYEE_ROLE.ADMIN
    const items = [
        {
            icon: <Dashboard/>,
            text: 'Painel de controle',
            url: ROUTES.HOME,
            show: isAdmin,
            isActive: pathname.includes(ROUTES.HOME),
            onClick() { pathname !== ROUTES.HOME && handleRoute(ROUTES.HOME) }
        },
        {
            icon: <Map/>,
            text: 'Mapa',
            url: ROUTES.MAP,
            show: true,
            isActive: pathname.includes(ROUTES.MAP),
            onClick() { pathname !== ROUTES.MAP && handleRoute(ROUTES.MAP) }
        },
        {
            icon: <AccountBox/>,
            text: 'Minha Conta',
            url: ROUTES.ACCOUNT,
            show: true,
            isActive: pathname.includes(ROUTES.ACCOUNT),
            onClick() { pathname !== ROUTES.ACCOUNT && handleRoute(ROUTES.ACCOUNT) }
        },
        {
            icon: <People/>,
            text: 'Funcionários',
            url: ROUTES.EMPLOYEES,
            show: true,
            isActive: pathname.includes(ROUTES.EMPLOYEES),
            onClick() { pathname !== ROUTES.EMPLOYEES && handleRoute(ROUTES.EMPLOYEES) }
        },
        {
            icon: <History/>,
            text: 'Histórico',
            url: ROUTES.HISTORY,
            show: isAdmin,
            isActive: pathname.includes(ROUTES.HISTORY),
            onClick() { pathname !== ROUTES.HISTORY && handleRoute(ROUTES.HISTORY) }
        },
        {
            icon: <QuestionAnswer/>,
            text: 'Dúvidas e sugestões',
            url: ROUTES.SUGGESTION,
            show: true,
            isActive: pathname.includes(ROUTES.SUGGESTION),
            onClick() { pathname !== ROUTES.SUGGESTION && handleRoute(ROUTES.SUGGESTION) }
        },
        {
            icon: <LocationOn/>,
            text: 'Dispositivos',
            url: ROUTES.DEVICES,
            show: true,
            isActive: pathname.includes(ROUTES.DEVICES),
            onClick() { pathname !== ROUTES.DEVICES && handleRoute(ROUTES.DEVICES) }
        },
        {
            icon: <Directions/>,
            text: 'Linhas',
            url: ROUTES.LINES,
            show: true,
            isActive: pathname.includes(ROUTES.LINES),
            onClick() { pathname !== ROUTES.LINES && handleRoute(ROUTES.LINES) }
        },
        {
            icon: <Drafts/>,
            text: 'Notícias',
            url: ROUTES.NEWS,
            show: true,
            isActive: pathname.includes(ROUTES.NEWS),
            onClick() { pathname !== ROUTES.NEWS && handleRoute(ROUTES.NEWS) }
        },
    ]
    function handleRoute(route) {
        props.history.push(route)
    }

    function buildListItem() {
        return items.map((item, index) => {
            if (item.show) {
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
            }
            return null
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
                <img className={classes.img} src={LOGO} />
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