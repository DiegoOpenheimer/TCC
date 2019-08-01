import React, { useEffect, useState } from 'react'
import { requestDevices, removeDevice, updateDevice } from '../../../redux/devices/action'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import {
    makeStyles,
    TablePagination,
    Paper,
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    Fab
} from '@material-ui/core'
import { Search, Add } from '@material-ui/icons'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { withRouter } from 'react-router-dom'
import { ROUTES } from '../../../utils/constants'
import { compose } from 'recompose'
import MaterialTable from 'material-table'

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
        right: theme.spacing(2),
        backgroundColor: '#3f51b5',
        color: '#FFF',
        borderRadius: '50%'
    }
}))

const Devices = props => {

    const classes = createStyle()
    const subject = new Subject()
    subject
    .pipe(debounceTime(300))
    .subscribe(value => {
        setText(value)
        props.requestDevices(1, 10, value)
    })
    
    const [ text, setText ] = useState('')
    useEffect(() => {
        if (props.location.pathname === ROUTES.DEVICES) {
            props.requestDevices(props.page, props.limit, text, null, () => {
                toast.error('Falha na comunicação com o servidor')
            })
        }
        return () => subject.complete()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.location.pathname ])
    function requestServer(page = props.page) {
        if (!props.isLoading) {
            props.requestDevices(page, props.limit, text, null, () => {
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

    return (
        <Grid container>
            <Grid className={classes.root}>
                    <TextField
                        onChange={ev => subject.next(ev.target.value)}
                        className={classes.input}
                        variant="outlined"
                        label="Procurar"
                        placeholder="Digite aqui para filtrar na tabela"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><IconButton onClick={() => props.requestDevices(1, 10, text)}><Search /></IconButton></InputAdornment>
                        }}
                    />
                    <Paper className={classes.tableWrapper}>
                        <MaterialTable
                                options={{
                                 search: false,
                                 actionsColumnIndex: -1
                                }}
                            localization={{
                                    header: {
                                        actions: 'Ações'
                                    },
                                    body: {
                                        emptyDataSourceMessage: 'Nenhum dispositivo para mostrar',
                                        filterRow: {
                                            filterTooltip: 'Filtrar'
                                        },
                                        editRow: {
                                            deleteText: 'Deseja remover esse dispositivo?'
                                        }
                                    },
                                    toolbar: {
                                        searchTooltip: 'Procurar',
                                        searchPlaceholder: 'Digite aqui para buscar dispositivo'
                                    }
                                }}
                            components={{
                                Pagination: renderFooter
                            }}
                            columns={[
                                { title: 'Nome', field: 'name' },
                                { title: 'Identificador', field: 'uuid', editable: 'never' },
                                { title: 'Linha', field: 'lineNumber', type: 'numeric' },
                                { title: 'Descrição da linha', field: 'lineDescription', editable: 'never' },
                            ]}
                            title="Dispositivos"
                            onRowClick={console.log}
                            data={props.docs}
                            editable={{
                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve) => {
                                        updateDevice(newData, () => {
                                            props.requestDevices(props.page, props.limit, text, resolve, () => {
                                                toast.error('Falha na comunicação com o servidor')
                                            })
                                            toast.success('Dispositivo editado com sucesso')
                                        }, () => {
                                            resolve()
                                            toast.error('Falha ao editar dispositivo')
                                        })
                                    }),
                                onRowDelete: oldData =>
                                    new Promise((resolve) => {
                                        props.removeDevice(oldData._id, () => {
                                            toast.success('Dispositivo removido com sucesso')
                                            props.requestDevices(props.page, props.limit, text, resolve, () => {
                                                toast.error('Falha na comunicação com o servidor')
                                            })
                                        }, () => toast.error('Falha ao remover dispositivo'))
                                    })
                            }}
                        />
                     </Paper>
                </Grid>
                <Fab onClick={() => props.history.push(ROUTES.ADD_DEVICES)} className={classes.fab} color="primary">
                    <Add />
                </Fab>
        </Grid>
    )
}

const mapStateToProps = state => ({
    ...state.device.data,
    isLoading: state.component.loading,
})

export default compose(
    connect(mapStateToProps, { requestDevices, removeDevice }),
    withRouter
)(Devices)
