import { makeStyles } from '@material-ui/core'

export default makeStyles({
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
    
})