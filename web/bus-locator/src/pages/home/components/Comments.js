import React, { useState, useEffect } from 'react'
import { Dialog, IconButton, Grid, Paper, Tabs, Tab, makeStyles, Typography, CircularProgress } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import network from '../../../services/network'
import { updateLoading } from '../../../redux/components/action'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

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
    const [ comment, setComment ] = useState({ docs: [], page: 1, pages: 2, limit: 20, total: 0, isFetching: false })

    useEffect(() => {
        window.addEventListener('scroll', load)
        return () => window.removeEventListener('scroll', load)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [  ])

    useEffect(() => {
        if (props.idLine) {
            requestServer()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.idLine ])

    useEffect(() => {
        if (comment.isFetching) {
            requestServer(comment.page + 1)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ comment.isFetching ])

    function requestServer(page = comment.page) {
        dispatch(updateLoading(true))
        network.get(`line/score/${props.idLine}?page=${page}&limit=${comment.limit}`)
        .then(response => {
            console.log(response.data)
            dispatch(updateLoading(false))
            setComment({ ...comment, ...response.data, docs: [...comment.docs, ...response.data.docs] })
        })
        .catch(_ => {
            dispatch(updateLoading(false))
            toast.error('Falha de comunicação com o servidor')
        })
    }

    function load() {
        console.log('ok')
        if (
            window.innerHeight + document.documentElement.scrollTo !== document.documentElement.offsetHeight ||
            comment.isFetching ||
            comment.page === comment.pages
        ) {
            return
        }
        console.log('ok')
        setComment({ ...comment, isFetching: true })
    }

    function buildItems() {
        return comment.docs.map((sc, index) => {
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
                { buildItems() }
                { comment.isFetching && <CircularProgress /> }
            </Grid>
        </Dialog>
    )
}

export default Comments