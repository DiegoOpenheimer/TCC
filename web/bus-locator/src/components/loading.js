import React from 'react'
import { LinearProgress } from '@material-ui/core'
import createStyle from '../style/global'
import { useSelector } from 'react-redux'

export default function(){
    
    const classes = createStyle()
    const loading = useSelector(state => state.component.loading)
    if (!loading) {
        return <div></div>
    }
    return (
        <LinearProgress color="primary" className={classes.linearProgress} />
    )
}
