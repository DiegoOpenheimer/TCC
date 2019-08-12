import React, { useState, useEffect } from 'react'
import { Dialog, IconButton, Grid, Paper, Tabs, Tab, makeStyles, Typography, CircularProgress } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import network from '../../../services/network'
import { updateLoading } from '../../../redux/components/action'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import InfiniteScroll from 'react-infinite-scroller'

const createStyle = makeStyles({
    root: {
        flexGrow: 1
    },
    icon: {
        position: 'absolute',
        left: 16,
    },
    contentTitle: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 16
    }
})

const Comments = props => {

    const dispatch = useDispatch()
    const classes = createStyle()
    const [tab, setTab] = useState(4)
    const [ comment, setComment ] = useState({ score: [] })
    const [ paginate, setPaginate ] = useState({ skip: 0, limit: 20 })

    useEffect(() => {
        if (props.idLine) {
            dispatch(updateLoading(true))
            network.get(`line/score/${props.idLine}?skip=${paginate.skip}&limit=${paginate.limit}`)
            .then(response => {
                console.log(response.data)
                dispatch(updateLoading(false))
                setComment({ ...comment, ...response.data })
            })
            .catch(_ => {
                dispatch(updateLoading(false))
                toast.error('Falha de comunicação com o servidor')
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.idLine ])

    function load(ev) {
        console.log('nice', ev)
    }

    function buildItems() {
        return comment.score.map((sc, index) => {
            return (
                <div key={index.toString()}>{ sc.description }</div>
            )
        })
    }
    
    return(
        <Dialog open={props.open} fullScreen>
            <div className={classes.contentTitle}>
                <IconButton className={classes.icon} onClick={props.onClose}>
                    <Close />
                </IconButton>
                <Typography variant="h4">Comentários</Typography>
            </div>
            <Grid container direction="column" wrap="nowrap">
                <Paper className={classes.root}>
                    <Tabs indicatorColor="primary" textColor="primary" centered value={tab} onChange={(ev, value) => setTab(value)} aria-label="simple tabs example">
                    <Tab label="1 estrela" />
                    <Tab label="2 estrela"/>
                    <Tab label="3 estrela" />
                    <Tab label="4 estrela" />
                    <Tab label="5 estrela" />
                    </Tabs>
                </Paper>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={load}
                    loader={<CircularProgress />}
                >
                    { buildItems() }
                </InfiniteScroll>
            </Grid>
        </Dialog>
    )
}

export default Comments