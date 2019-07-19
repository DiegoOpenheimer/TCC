import React, { useEffect } from 'react'
import { requestEmployees, filterIndexDocs, updatePage, clear } from '../../redux/employees/action'
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
    Button,
    TextField,
    InputAdornment,
    IconButton
} from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { Status, Role } from './components/status'
import { EMPLOYEE_ROLE } from '../../utils/constants'
import { Delete } from '@material-ui/icons'
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
    }
}))

const Employee = props => {

    const classes = createStyle()

    const subject = new Subject()
    subject
    .pipe(debounceTime(300))
    .subscribe(value => {
        console.log(value)
    })
    
    useEffect(() => {
        requestServer()
        return () => {
            props.clear()
            subject.complete()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [  ])

    function requestServer(page = props.data.page) {
        props.requestEmployees(page, props.data.limit, () => {
            toast.error('Falha na comunicação com o servidor')
        })
    }

    function buildItems() {
        return props.docs.map(employee => {
            return (
                <TableRow key={employee._id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell><Status status={employee.status} /></TableCell>
                    <TableCell><Role role={employee.role} /></TableCell>
                    {
                        props.user.role === EMPLOYEE_ROLE.ADMIN &&
                        <TableCell component="th">
                            <Button variant="outlined" color="secondary">
                                Remover
                                <Delete className={classes.rightIcon} />
                            </Button>
                        </TableCell>
                    }
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
                placeholder="Procure por nome ou email"
                InputProps={{
                    startAdornment: <InputAdornment position="start"><IconButton><Search /></IconButton></InputAdornment>
                }}
            />
            <Paper className={classes.tableWrapper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell component="th" >Nome</TableCell>
                            <TableCell component="th">Email</TableCell>
                            <TableCell component="th">Status</TableCell>
                            <TableCell component="th">Papel</TableCell>
                            {
                                props.user.role === EMPLOYEE_ROLE.ADMIN &&
                                <TableCell component="th">Remover</TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { buildItems() }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                labelDisplayedRows={({from, to, count}) => `${from}-${to} de ${count}`}
                                rowsPerPage={10}
                                rowsPerPageOptions={[]}
                                count={props.data.total}
                                page={props.data.page - 1}
                                onChangePage={(_, page) => {
                                    const newPage = page + 1
                                    const size = props.data.docs.length
                                    const value = newPage * props.data.limit
                                    console.log(newPage, value, size)
                                    props.updatePage(newPage)
                                    if (value <= size) {
                                        props.filterIndexDocs(value, props.data.limit, props.data.docs)
                                    } else {
                                        requestServer(newPage)
                                    }
                                }}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </Paper>
        </Grid>
    )
}

const mapStateToProps = state => ({
    data: state.employee.data,
    isLoading: state.employee.isLoading,
    user: state.home.user,
    docs: state.employee.docs
})

export default connect(mapStateToProps, { requestEmployees, filterIndexDocs, updatePage, clear })(Employee)