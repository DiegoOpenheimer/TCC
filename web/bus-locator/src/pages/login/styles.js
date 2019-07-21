import { makeStyles } from '@material-ui/core'

const styles = makeStyles({
    root: {
        minHeight: '100vh',
    },
    contentLogo: {
        backgroundColor: '#536dfe',
        color: '#FFF',
        flex: 2,
        fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif;`,
        '@media (max-width: 1200px)': {
            display: 'none'
        }
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
    }
})

export default styles