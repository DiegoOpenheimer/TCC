import { makeStyles } from '@material-ui/core'
import image from '../../assets/connected_world.svg'

const drawerWidth = 240

export default makeStyles(theme => ({
    appBar: {
        boxShadow: 'none',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
    },
    toolbar: {
        backgroundColor: '#FFF',
        borderBottom: '1px solid #DFE3E8',
    },
    title: {
        flexGrow: 1,
        color: '#000'
    },
    paper: {
        boxShadow: 'none',
        border: '1px solid #DFE3E8',
        padding: 16,
        color: '#66788A'
    },
    content: {
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: '#f8fafc'
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`
    },
    result: {
        color: '#000'
    },
    contentIcon: {
        flex: 1
    },
    contentInformation: {
        flex: 2
    },
    icon: {
        backgroundColor: '#45B880',
        color: '#FFF',
        padding: 16,
        fontSize: 50,
        borderRadius: '50%',
    },
    popoverHeader: {
        backgroundImage: `url(${image})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundColor: '#f8fafc',
        backgroundPosition: 'right',
        width: 350,
        padding: 30
    },
    removePadding: {
        padding: 0
    },
    contentCard: {
        padding: 16
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    }
}))