import { makeStyles } from '@material-ui/core'

export default makeStyles({
    maxContainer: {
        minHeight: '100vh',
    },
    linearProgress: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 10000
    },
    container: {
        padding: 16
    },
    marginVertical: {
        margin: props => `${props.marginVertical} 0px`
    },
    maxWidth: {
        width: '100%'
    },
    maxHeight: {
        height: '100%'
    }
})