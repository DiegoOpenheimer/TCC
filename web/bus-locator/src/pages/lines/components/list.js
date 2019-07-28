import React from 'react'
import { Fab, Grid, makeStyles } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import { ROUTES } from '../../../utils/constants'

const styles = makeStyles(theme => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    }
}))

export default withRouter(props => {

    const classes = styles()

    return (
        <Grid container>
            <Fab onClick={() => props.history.push(ROUTES.ADD_LINES)} className={classes.fab} color="primary">
                <Add />
            </Fab>
        </Grid>
    )
})