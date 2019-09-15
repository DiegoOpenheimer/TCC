import { makeStyles } from '@material-ui/core'
import backgroundImage from '../../assets/google-maps.png'

const styles = makeStyles({
    root: {
        minHeight: '100vh',
    },
    contentLogo: {
        color: '#FFF',
        flex: 2,
        fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif;`,
        '@media (max-width: 1200px)': {
            display: 'none'
        },
        background: `url(${backgroundImage}) no-repeat center center`,
        backgroundSize: 'cover',
        position: 'relative'
    },
    tabs: {
        marginBottom: 16
    },
    fields: {
        flex: 1.4,
    },
    textTab: {
        fontSize: '20px'
    },
    textPresent: {
        fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif;`,
        color: '#4A4A4A'
    },
    textFields: {
        margin: '16px 0px'
    },
    contentForgotPassword: {
        width: '70%',
        height: '80%',
    },
    linearProgress: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
    },
    addMarginBottom: {
        marginBottom: 10
    },
    content: {
        padding: '0px 16px'
    },
    backgroundFilter: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: 'linear-gradient(to bottom, rgba(211, 218, 222, 0.8) 14%, rgba(200, 213, 226, 0.8) 45%, rgba(57, 143, 241, 0.8) 100%)'
    }
})

export default styles