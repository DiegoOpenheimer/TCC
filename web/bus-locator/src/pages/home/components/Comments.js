import React, { useState, useEffect } from 'react'
import {
    Dialog,
    IconButton,
    Grid,
    Paper,
    Tabs,
    Tab,
    makeStyles,
    Typography,
    Slide,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableFooter,
    TablePagination
} from '@material-ui/core'
import { Close, StarRate, Star } from '@material-ui/icons'
import network, { CancelToken } from '../../../services/network'
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

let cancel

const TransitionSlide = React.forwardRef(function(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
})

const Comments = props => {

    const dispatch = useDispatch()
    const classes = createStyle()
    const [tab, setTab] = useState(4)
    const [ comment, setComment ] = useState({ docs: [], page: 1, pages: 1, limit: 10, total: 0 })

    useEffect(() => {
        if (props.idLine) {
            requestServer(comment.page, tab)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.idLine ])

    function requestServer(page = comment.page, star = tab, error) {
        dispatch(updateLoading(true))
        if (cancel) {
            cancel('cancelled')
        }
        network.get(`line/score/${props.idLine}?page=${page}&limit=${comment.limit}&star=${star + 1}`, {
            cancelToken: new CancelToken(c => cancel = c)
        })
        .then(response => {
            dispatch(updateLoading(false))
            setComment({ ...comment, ...response.data })
        })
        .catch(e => {
            if (e && e.message === 'cancelled') {
                return
            }
            if (error) {
                error()
            }
            dispatch(updateLoading(false))
            toast.error('Falha de comunicação com o servidor')
        })
    }
    function buildItems() {
        return comment.docs.map((sc, index) => {
            return (
                <TableRow key={index.toString()}>
                    <TableCell>{sc.user.name}</TableCell>
                    <TableCell>{sc.description}</TableCell>
                    <TableCell>{sc.line.number} - {sc.line.description}</TableCell>
                    <TableCell><Grid container wrap="nowrap">{buildStar(sc.star)}</Grid></TableCell>
                    <TableCell>{new Date(sc.createdAt).toLocaleString()}</TableCell>
                </TableRow>
            )
        })
    }

    function buildStar(star) {
        const stars = []
        for (let i = 0; i < star; i ++) {
            stars[i] = <StarRate key={i.toString()} />
        }
        return stars
    }

    function renderFooter() {
        return (
            <TablePagination
                labelDisplayedRows={({from, to, count}) => `${from}-${to} de ${count}`}
                rowsPerPage={10}
                rowsPerPageOptions={[]}
                count={comment.total}
                page={comment.page - 1}
                onChangePage={(_, page) => {
                    const newPage = page + 1
                    requestServer(newPage)
                }}
            />
        )
    }
    
    return(
        <Dialog open={props.open} fullScreen TransitionComponent={TransitionSlide} style={{backgroundColor: 'transparent'}}>
            <div className={classes.contentTitle}>
                <IconButton className={classes.icon} onClick={props.onClose}>
                    <Close />
                </IconButton>
                <Typography variant="h4">Comentários</Typography>
            </div>
            <Grid container direction="column" wrap="nowrap">
                <Paper className={classes.root}>
                    <Tabs indicatorColor="primary" textColor="primary" centered value={tab} onChange={(ev, value) => {
                        const oldTab = tab
                        setTab(value)
                        requestServer(1, value, () => setTab(oldTab))
                    }} aria-label="simple tabs example">
                    <Tab label="1 estrela" />
                    <Tab label="2 estrelas"/>
                    <Tab label="3 estrelas" />
                    <Tab label="4 estrelas" />
                    <Tab label="5 estrelas" />
                    </Tabs>
                </Paper>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell component="th" >Usuário</TableCell>
                            <TableCell component="th">Mensagem</TableCell>
                            <TableCell component="th">Linha</TableCell>
                            <TableCell component="th">Estrelas</TableCell>
                            <TableCell component="th">Criado em</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { buildItems() }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                        { renderFooter() }
                        </TableRow>
                    </TableFooter>
                </Table>
            </Grid>
        </Dialog>
    )
}

export default Comments