import React, { useEffect, useState } from 'react'
import { requestEmployees, removeEmployee } from '../../redux/employees/action'
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
    IconButton,
} from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { Status, Role } from '../../components/status'
import { EMPLOYEE_ROLE } from '../../utils/constants'
import { Delete } from '@material-ui/icons'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import Dialog from '../../components/dialog'
import CustomDialog from '../../components/CustomDialog'

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

const Employee = props => {

    const classes = createStyle()

    const subject = new Subject()
    subject
    .pipe(debounceTime(300))
    .subscribe(value => {
        setText(value)
        props.requestEmployees(1, 10, value)
    })
    
    const [ text, setText ] = useState('')
    const [ open, setOpen ] = useState(false)
    const [ openCustomDialog, setOpenCustomDialog ] = useState(false)
    const [ user, setUser ] = useState({ name: '', email: ''})
    let emailToBeRemoved = ''
    const isAdmin = props.user.role === EMPLOYEE_ROLE.ADMIN
    useEffect(() => {
        requestServer()
        return () => subject.complete()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [  ])

    function requestServer(page = props.data.page) {
        if (!props.isLoading) {
            props.requestEmployees(page, props.data.limit, text, () => {
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
                count={props.data.total}
                page={props.data.page - 1}
                onChangePage={(_, page) => {
                    const newPage = page + 1
                    requestServer(newPage)
                }}
            />
        )
    }

    function buildItems() {
        return props.data.docs.map(employee => {
            return (
                <TableRow onClick={() => {
                    setUser(employee)
                    setOpenCustomDialog(true)
                }} hover={isAdmin} key={employee._id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell><Status status={employee.status} /></TableCell>
                    <TableCell><Role role={employee.role} /></TableCell>
                    {
                        isAdmin &&
                        <TableCell component="th">
                            <Button onClick={ev => {
                                ev.stopPropagation()
                                setOpen(true)
                                setUser(employee)
                            }} variant="outlined" color="secondary">
                                Remover
                                <Delete className={classes.rightIcon} />
                            </Button>
                        </TableCell>
                    }
                </TableRow>
            )
        })
    }

    function deleteUser() {
        setOpen(false)
        if (emailToBeRemoved !== user.email) {
            emailToBeRemoved = user.email
            props.removeEmployee(user, () => {
                toast.success('Usuário removido com sucesso', { autoClose: 2000 })
                props.requestEmployees(props.data.page, props.data.limit)
            }, () => toast.error('Falha ao deletar usuário'))
        }
    }
    return (
        <Grid className={classes.root}>
            <TextField
                onChange={ev => subject.next(ev.target.value)}
                className={classes.input}
                variant="outlined"
                label="Procurar"
                placeholder="Digite aqui para buscar"
                InputProps={{
                    startAdornment: <InputAdornment position="start"><IconButton onClick={() => props.requestEmployees(1, 10, text)}><Search /></IconButton></InputAdornment>
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
                                isAdmin &&
                                <TableCell component="th">Remover</TableCell>
                            }
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
            <Dialog 
                open={open}
                onClose={setOpen}
                title="Atenção"
                message={`Deseja remover o usuário ${user.name}?`}
                negativeButton="Não"
                positiveButton="Sim"
                negativeAction={() => setOpen(false)}
                positiveAction={() => deleteUser()}
            />
            <CustomDialog
                message="Deseja aleterar permissão desse usuário?"
                messageCheckBox="Administrador"
                success={() => {
                    setOpenCustomDialog(false)
                    requestServer()
                    toast.success('Usuário editado', { autoClose: 2000 })
                }}
                error={() => {
                    setOpenCustomDialog(false)
                    toast.error('Falha editar usuário', { autoClose: 2000 })
                }}
                user={user}
                open={openCustomDialog}
                negativeAction={() => setOpenCustomDialog(false)}
            />
        </Grid>
    )
}

const mapStateToProps = state => ({
    data: state.employee.data,
    isLoading: state.component.loading,
    user: state.home.user,
})

export default connect(mapStateToProps, { requestEmployees, removeEmployee })(Employee)