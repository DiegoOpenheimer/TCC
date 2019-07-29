import React, { useEffect, useState } from 'react'
import { requestLines, removeLine } from '../../../redux/lines/action'
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
    Button,
    Fab
} from '@material-ui/core'
import { Search, Delete, Add } from '@material-ui/icons'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { withRouter } from 'react-router-dom'
import { ROUTES } from '../../../utils/constants'
import { compose } from 'recompose'

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
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    }
}))

const Lines = props => {

    const classes = createStyle()
    const subject = new Subject()
    subject
    .pipe(debounceTime(300))
    .subscribe(value => {
        setText(value)
        props.requestLines(1, 10, value)
    })
    
    const [ text, setText ] = useState('')
    useEffect(() => {
        if (props.location.pathname === ROUTES.LINES) {
            props.requestLines(props.page, props.limit, text, () => {
                toast.error('Falha na comunicação com o servidor')
            })
        }
        return () => subject.complete()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.location.pathname ])
    function requestServer(page = props.page) {
        if (!props.isLoading) {
            props.requestLines(page, props.limit, text, () => {
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
        return props.docs.map(line => {
            return (
                <TableRow onClick={() => props.history.push(ROUTES.ADD_LINES.concat(`/${line._id}`))} hover key={line._id}>
                    <TableCell align="center">{line.number}</TableCell>
                    <TableCell align="center">{line.description}</TableCell>
                    <TableCell align="center">
                        <Button onClick={ev => {
                            ev.stopPropagation()
                            props.removeLine(line._id, () => {
                                toast.success('Linha removida com sucesso')
                                requestServer()
                            }, () => toast.error('Falha ao remover linha'))
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
                        className={classes.input}
                        variant="outlined"
                        label="Procurar"
                        placeholder="Digite aqui para buscar por número ou descrição"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><IconButton onClick={() => props.requestLines(1, 10, text)}><Search /></IconButton></InputAdornment>
                        }}
                    />
                    <Paper className={classes.tableWrapper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" component="th" >Número</TableCell>
                                    <TableCell align="center" component="th">Descrição</TableCell>
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
                <Fab onClick={() => props.history.push(ROUTES.ADD_LINES)} className={classes.fab} color="primary">
                    <Add />
                </Fab>
        </Grid>
    )
}

const mapStateToProps = state => ({
    ...state.line.data,
    isLoading: state.component.loading,
})

export default compose(
    connect(mapStateToProps, { requestLines, removeLine }),
    withRouter
)(Lines)
