import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
    input: {
        minWidth: '30vw',
        marginLeft: 16
    },
    inputLine: {
        marginLeft: 16
    },
    contentBlockMap: {
        maxHeight: '80vh',
        padding: '16px 0px'
    },
    contentFields: {
        flex: .5,
        display: 'block',
        padding: 8,
        overflowY: 'auto'
    },
    contentMap: {
        flex: 1
    },
    addIconField: {
        padding: '12px 0px'
    },
    iconRemove: {
        '&:hover $iconHiddenRemove': {
            visibility: 'visible !important'
        }
    },
    iconHiddenRemove: {
        visibility: 'hidden'
    },
    contentContainerMap: {
        height: 'calc(80vh - 16px)'
    },
    buttonSave: {
        marginLeft: 16,
        '& svg': {
            marginRight: 10
        }
    },
    inputRegisterNews: {
        width: '50vw',
        marginTop: 16
    },
    textMessage: {
        margin: '16px 0px'
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
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    }
}))