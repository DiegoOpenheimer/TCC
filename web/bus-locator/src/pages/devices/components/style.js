import { makeStyles, colors } from '@material-ui/core'

export default makeStyles(theme => ({
    content: {
        width: '100%',
        '& h2': {
            color: 'rgba(0,0,0,.38)'
        }
    },
    padding: {
        padding: 16,
    },
    margin: {
        margin: 16,
    },
    input: {
        width: '30%'
    },
    colorPositive: {
        color: `${colors.green.A700} !important`
    },
    colorNegative: {
        color: `${colors.red.A700} !important`
    },
    textResult: {
        marginLeft: 16
    },
    root: {
        width: '100%',
        padding: 32,
    },
    tableWrapper: {
        overflowX: 'auto',
        marginTop: 32,
        width: '100%'
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    inputSearch: {
        minWidth: '50%'
    },
    tableCellFooter: {
        paddingRight: '32px !important'
    },
    fab: {
        position: 'fixed !important',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        backgroundColor: '#3f51b5 !important',
        color: '#FFF !important',
        borderRadius: '50% !important'
    }
}))