import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
    title: {
        margin: 0,
        fontWeight: 'normal',
    },
    contentTitle: {
        display: 'flex',
        margin: '5px 32px',
        alignItems: 'center',
        '& h3': {
            marginLeft: 16,
            marginTop: 3
        }
    },
    contentTalk: {
        maxHeight: 'calc(100vh - 65px)'
    },
    contentMessages: {
        flex: 1,
        overflowY: 'auto',
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
        flex: 1,
        padding: 5
    },
    icon: {
        marginLeft: theme.spacing(1)
    },
    footer: {
        flex: .3,
        padding: 16
    },
    contentField: {
        width: '100%',
        minHeight: '20vh',
        display: 'flex',
        flexDirection: 'column'
    },
    contentButton: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    contentList: {
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: '0px 32px 5px 32px'
    },
    card: {
        boxShadow: '0 1px 15px rgba(0,0,0,.04), 0 1px 6px rgba(0,0,0,.04)',
        borderRadius: 'calc(.15rem - 1px)',
        border: 'initial',
        backgroundColor: '#FFF',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        width: 'max-content',
        maxWidth: '70%'
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
        marginTop: 16,
        width: '100%'
    },
    contentRight: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    date: {
        marginLeft: '16px !important',
        fontSize: '.6rem'
    },
    name: {
        fontStyle: 'italic'
    },
    contentTime: {
        display: 'flex',
        alignItems: 'center'
    }
}))
