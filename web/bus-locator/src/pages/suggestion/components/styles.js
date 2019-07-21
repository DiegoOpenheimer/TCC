import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
    title: {
        margin: 0,
        fontWeight: 'normal'
    },
    contentMessages: {
        flex: 1,
        padding: 32,
        overflowY: 'auto'
    },
    input: {
        flex: 1,
        alignItems: 'flex-start'
    },
    contentInputMessage: {
        border: '1px solid #DFE3E8',
        backgroundColor: '#FFF',
        borderRadius: 2,
        display: 'flex',
        marginTop: 20,
        padding: 16,
        flex: 1
    },
    icon: {
        marginLeft: theme.spacing(1)
    },
    contentField: {
        width: '50%',
        minHeight: '50%',
        display: 'flex',
        flexDirection: 'column'
    },
    contentButton: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    contentList: {
        display: 'flex'
    },
    card: {
        boxShadow: '0 1px 15px rgba(0,0,0,.04), 0 1px 6px rgba(0,0,0,.04)',
        borderRadius: 'calc(.15rem - 1px)',
        border: 'initial',
        backgroundColor: '#FFF',
        padding: 16,
        display: 'flex',
        flexDirection: 'column'
    },
    cardMessage: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& p': {
            margin: 0
        }
    },
    contentCard: {
        marginTop: 16
    },
    date: {
        marginLeft: '16px !important',
        fontSize: '.6rem'
    },
    name: {
        fontStyle: 'italic'
    }
}))
