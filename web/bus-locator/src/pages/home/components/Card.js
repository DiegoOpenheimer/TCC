import React from 'react'
import createStyleLocal from '../style' 
import { Paper, Typography, Icon, Grid, IconButton } from '@material-ui/core'
import Skeleton from 'react-loading-skeleton'
import { Replay } from '@material-ui/icons'

const Card = props => {

    const { title, content, icon, isLoading, error, buttonError, styleIcon, textColors, styleCard } = props
    const classesLocal = createStyleLocal()
    const checkLoading = () => {
        if (isLoading) {
            return <Skeleton circle={true} height={50} width={50} />
        } else if (error) {
            return (
                <div>
                    <IconButton onClick={buttonError} >
                        <Replay style={textColors && {color: textColors}} />
                    </IconButton>
                </div>
            )
        }
        return <Typography style={textColors && {color: textColors}} className={classesLocal.result} variant="h4">{content}</Typography>
    }

    return (
        <Grid className={classesLocal.card} item xs={12} sm={4} md={4} lg={3} xl={3}>
            <Paper style={styleCard} className={classesLocal.paper}>
                <Grid container direction="row" wrap="nowrap" justify="center" alignItems="center">
                    <Grid className={classesLocal.contentInformation} item container direction="column">
                        <p style={textColors && {color: textColors}}>{title}</p>
                        { checkLoading() }
                    </Grid>
                    <Grid className={classesLocal.contentIcon} container>
                        <Icon className={classesLocal.icon} style={styleIcon}>{icon}</Icon>
                    </Grid>
                </Grid>                      
            </Paper>
        </Grid>
    )

}

export default Card