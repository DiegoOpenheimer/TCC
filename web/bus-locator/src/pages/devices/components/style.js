import { makeStyles, colors } from '@material-ui/core'

export default makeStyles({
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
    }
})