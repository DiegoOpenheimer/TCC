import { makeStyles } from '@material-ui/core'
import image from '../../assets/connected_world.svg'

const drawerWidth = 240

export default makeStyles({
    appBar: {
        boxShadow: 'none'
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
        padding: 16
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
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
      },
      drawerPaper: {
        width: drawerWidth,
    }
})