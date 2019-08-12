import React, { useEffect, useState } from 'react'
import { requestNews, removeNews } from '../../../redux/news/action'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import {
    Table,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
    TableFooter,
    TablePagination,
    Paper,
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Fab
} from '@material-ui/core'
import { Search, Delete, Add } from '@material-ui/icons'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { withRouter } from 'react-router-dom'
import { ROUTES } from '../../../utils/constants'
import { compose } from 'recompose'
import createStyle from '../styles'
import parser from 'html-react-parser'

const News = props => {

    const classes = createStyle()
    const subject = new Subject()
    subject
    .pipe(debounceTime(300))
    .subscribe(value => {
        setText(value)
        props.requestNews(1, 10, value)
    })
    
    const [ text, setText ] = useState('')
    useEffect(() => {
        if (props.location.pathname === ROUTES.NEWS) {
            props.requestNews(props.page, props.limit, text, () => {
                toast.error('Falha na comunicação com o servidor')
            })
        }
        return () => subject.complete()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.location.pathname ])
    function requestServer(page = props.page) {
        if (!props.isLoading) {
            props.requestNews(page, props.limit, text, () => {
                toast.error('Falha na comunicação com o servidor')
            })

        }
    }

    function renderFooter() {
        return (
            <TablePagination
                labelDisplayedRows={({from, to, count}) => `${from}-${to} de ${count}`}
                rowsPerPage={10}
                rowsPerPageOptions={[]}
                count={props.total}
                page={props.page - 1}
                onChangePage={(_, page) => {
                    const newPage = page + 1
                    requestServer(newPage)
                }}
            />
        )
    }

    function buildItems() {
        return props.docs.map(news => {
            return (
                <TableRow onClick={() => props.history.push(ROUTES.ADD_NEWS.concat(`/${news._id}`))} hover key={news._id}>
                    <TableCell>{news.author ? news.author.name : ''}</TableCell>
                    <TableCell>{news.title}</TableCell>
                    <TableCell>{parser(news.message)}</TableCell>
                    <TableCell>{new Date(news.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                        <Button onClick={ev => {
                            ev.stopPropagation()
                            props.removeNews(news._id, () => {
                                toast.success('Notícia removida com sucesso')
                                requestServer()
                            }, () => toast.error('Falha ao remover notícia'))
                        }} color="secondary">
                            <Delete className={classes.rightIcon} />
                            <span>Remover</span>
                        </Button>
                    </TableCell>
                </TableRow>
            )
        })
    }
    return (
        <Grid container>
            <Grid className={classes.root}>
                    <TextField
                        onChange={ev => subject.next(ev.target.value)}
                        className={classes.inputSearch}
                        variant="outlined"
                        label="Procurar"
                        placeholder="Digite aqui para filtrar"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><IconButton onClick={() => props.requestNews(1, 10, text)}><Search /></IconButton></InputAdornment>
                        }}
                    />
                    <Paper className={classes.tableWrapper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" component="th" >Autor</TableCell>
                                    <TableCell align="center" component="th">Título</TableCell>
                                    <TableCell align="center" component="th">Mensagem</TableCell>
                                    <TableCell align="center" component="th">Criado em</TableCell>
                                    <TableCell align="center" component="th">Ação</TableCell>
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
                    </Paper>
                </Grid>
                <Fab onClick={() => props.history.push(ROUTES.ADD_NEWS)} className={classes.fab} color="primary">
                    <Add />
                </Fab>
        </Grid>
    )
}

const mapStateToProps = state => ({
    ...state.news.data,
    isLoading: state.component.loading,
})

export default compose(
    connect(mapStateToProps, { requestNews, removeNews }),
    withRouter
)(News)
