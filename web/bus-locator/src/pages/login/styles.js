import { makeStyles } from '@material-ui/core'

const styles = makeStyles({
    root: {
        height: '100%',
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
        flex: 1.2,
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
        width: 400,
        height: '80%',
    }
})

export default styles