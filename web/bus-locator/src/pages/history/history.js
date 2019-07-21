import React, { useEffect, useState } from 'react'
import { requestHistories } from '../../redux/history/action'
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

const createStyle = makeStyles(theme => ({
    root: {
        width: '100%',
        padding: 32
    },
    tableWrapper: {
        overflowX: 'auto',
        marginTop: 32
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

const History = props => {

    const classes = createStyle()

    const subject = new Subject()
    subject
    .pipe(debounceTime(300))
    .subscribe(value => {
        setText(value)
        props.requestHistories(1, 10, value)
    })
    
    const [ text, setText ] = useState('')
    useEffect(() => {
        requestServer()
        return () => subject.complete()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [  ])
    function requestServer(page = props.page) {
        if (!props.isLoading) {
            props.requestHistories(page, props.limit, text, () => {
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
        return props.docs.map(history => {
            return (
                <TableRow key={history._id}>
                    <TableCell>{history.email}</TableCell>
                    <TableCell>{history.reason}</TableCell>
                    <TableCell>{new Date(history.createdAt).toLocaleString()}</TableCell>
                </TableRow>
            )
        })
    }
    return (
        <Grid className={classes.root}>
            <TextField
                onChange={ev => subject.next(ev.target.value)}
                className={classes.input}
                variant="outlined"
                label="Procurar"
                placeholder="Digite aqui para buscar, para data: yyyy-mm-dd"
                InputProps={{
                    startAdornment: <InputAdornment position="start"><IconButton onClick={() => props.requestHistories(1, 10, text)}><Search /></IconButton></InputAdornment>
                }}
            />
            <Paper className={classes.tableWrapper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell component="th" >Usuário</TableCell>
                            <TableCell component="th">Mensagem</TableCell>
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
            </Paper>
        </Grid>
    )
}

const mapStateToProps = state => ({
    ...state.history,
    isLoading: state.component.loading,
})

export default connect(mapStateToProps, { requestHistories })(History)