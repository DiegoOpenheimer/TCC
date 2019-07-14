import React from 'react'
import createStyleLocal from '../style' 
import { Paper, Typography, Icon, Grid, CircularProgress, IconButton } from '@material-ui/core'
import { Replay } from '@material-ui/icons'

const Card = props => {

    const { title, content, icon, isLoading, error, buttonError } = props
    const classesLocal = createStyleLocal()
    const checkLoading = () => {
        if (isLoading) {
            return <CircularProgress />
        } else if (error) {
            return (
                <div>
                    <IconButton onClick={buttonError} >
                        <Replay />
                    </IconButton>
                </div>
            )
        }
        return <Typography className={classesLocal.result} variant="h4">{content}</Typography>
    }

    return (
        <Grid item xs={6} sm={6} md={6} lg={3} xl={3}>
            <Paper className={classesLocal.paper}>
                <Grid container direction="row" wrap="nowrap" justify="center" alignItems="center">
                    <Grid className={classesLocal.contentInformation} item container direction="column">
                        <p>{title}</p>
                        { checkLoading() }
                    </Grid>
                    <Grid className={classesLocal.contentIcon} container>
                        <Icon className={classesLocal.icon}>{icon}</Icon>
                    </Grid>
                </Grid>                      
            </Paper>
        </Grid>
    )

}

export default Card