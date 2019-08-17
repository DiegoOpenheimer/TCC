import React, { useEffect } from 'react'
import styles from './style'
import { connect } from 'react-redux'
import DialogRadio from '../../../components/dialogRadio'
import { Grid, TextField, Fab, Button } from '@material-ui/core'
import clsx from 'clsx'
import { updateName, openDialog, onClose, requestLines, clear, createDevice } from '../../../redux/devices/action'
import { toast } from 'react-toastify'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'

const mapStateToProps = state => ({ ...state.device, loading: state.component.loading })

export default
compose(
    connect( mapStateToProps, { updateName, openDialog, onClose, requestLines, clear, createDevice } ),
    withRouter
)(SecondStep)


function SecondStep(props) {

    const classes = styles()

    useEffect(() => {
        props.requestLines(() => toast.error('Falha na comunicação com o servidor'))
        return props.clear
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [  ])

    function save() {
        const body = {
            uuid: props.device.text,
            name: props.name,
            line: props.value,
            latitude: props.device.latitude,
            longitude: props.device.longitude
        }
        if (!body.uuid) {
            toast.error('Identificador do dispositivo está vazio')
            return
        }
        if (!body.line) {
            toast.info('Falta escolher a linha para associação')
            return
        }
        props.createDevice(body, () => {
            toast.success('Dispositivo cadastrado com sucesso')
            props.history.goBack()
        }, ({response}) => {
            if (response && response.status === 409) {
                toast.error('Dispositivo já cadastrado')
            } else {
                toast.error('Falha ao cadastrar dispositivo')
            }
        })
    }

    function buildResult() {
        if (props.value) {
            const line = props.lines.find(li => li._id === props.value)
            return <>{ line.number } - {line.description}</>
        }
    }

    return (
        <Grid container alignItems="center" justify="center" direction="column" className={clsx(classes.padding, classes.content)}>
            <h2>Associar dispositivo com uma linha:</h2>
            <TextField
                value={props.name}
                onChange={ev => props.updateName(ev.target.value)}
                className={classes.input}
                variant="outlined"
                placeholder="Informe um nome para o dispositivo"
                label="Nome"
            />
            <Grid container wrap="nowrap" justify="center">
                <p>Linha escolhida: </p>
                <p className={classes.textResult}>{buildResult()}</p>
            </Grid>
            <Button
                variant="outlined"
                disabled={props.loading}
                onClick={() => props.lines.length ? props.openDialog(true) : toast.info('Nenhuma linha para associar')}>
                Abrir opções
            </Button>
            <Grid>
                <Fab disabled={props.loading} className={classes.margin} color="primary" variant="extended" onClick={save}>
                    Salvar
                </Fab>
            </Grid>
            <DialogRadio
                open={props.open}
                options={props.lines}
                title="Atenção"
                textCancel="Cancelar"
                textConfirm="Ok"
                value={props.value}
                onClose={props.onClose}
            />
        </Grid>
    )

}