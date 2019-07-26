import React, { useEffect, useState } from 'react'
import { requestSuggestions } from '../../redux/suggestion/action'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import {
    makeStyles,
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
} from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import Talk from './components/talk'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'

const createStyle = makeStyles(theme => ({
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
    input: {
        minWidth: '50%'
    },
    tableCellFooter: {
        paddingRight: '32px !important'
    }
}))

const Suggestion = props => {

    const classes = createStyle()

    const subject = new Subject()
    subject
    .pipe(debounceTime(300))
    .subscribe(value => {
        setText(value)
        props.requestSuggestions(1, 10, value)
    })
    
    const [ text, setText ] = useState('')
    useEffect(() => {
        if (props.location.pathname === ROUTES.SUGGESTION) {
            props.requestSuggestions(props.page, props.limit, text, () => {
                toast.error('Falha na comunicação com o servidor')
            })
        }
        return () => subject.complete()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.location.pathname ])
    function requestServer(page = props.page) {
        if (!props.isLoading) {
            props.requestSuggestions(page, props.limit, text, () => {
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
        return props.docs.map(suggestion => {
            return (
                <TableRow onClick={() => props.history.push('/home/suggestion/' + suggestion._id)} hover key={suggestion._id}>
                    <TableCell align="center">{suggestion.name}</TableCell>
                    <TableCell align="center">{suggestion.title}</TableCell>
                    <TableCell align="center">{new Date(suggestion.createdAt).toLocaleString()}</TableCell>
                    <TableCell align="center">{suggestion.messages.length}</TableCell>
                </TableRow>
            )
        })
    }
    return (
        <Grid container>
            <Switch>
                <Route exact path={ROUTES.SUGGESTION} render={() => {
                    return (
                        <Grid className={classes.root}>
                            <TextField
                                onChange={ev => subject.next(ev.target.value)}
                                className={classes.input}
                                variant="outlined"
                                label="Procurar"
                                placeholder="Digite aqui para buscar, para data: yyyy-mm-dd"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><IconButton onClick={() => props.requestSuggestions(1, 10, text)}><Search /></IconButton></InputAdornment>
                                }}
                            />
                            <Paper className={classes.tableWrapper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" component="th" >Usuário</TableCell>
                                            <TableCell align="center" component="th">Título</TableCell>
                                            <TableCell align="center" component="th">Criado em</TableCell>
                                            <TableCell align="center" component="th">Quantidade de mensagens</TableCell>
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
                    )
                }} />
                <Route exact path={ROUTES.SUGGESTION.concat('/:id')} render={() => <Talk />} />
                <Redirect from="*" to={ROUTES.HOME} />
            </Switch>
        </Grid>
    )
}

const mapStateToProps = state => ({
    ...state.suggestion,
    isLoading: state.component.loading,
})

export default connect(mapStateToProps, { requestSuggestions })(Suggestion)