import React, { useState } from 'react'
import { Grid, Stepper, Step, StepLabel, makeStyles, TextField, Fab, colors } from '@material-ui/core'
import { updateLoading } from '../../../redux/components/action'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import clsx from 'clsx'

const styles = makeStyles({
    content: {
        width: '100%',
        '& h2': {
            color: 'rgba(0,0,0,.38)'
        }
    },
    padding: {
        padding: 16,
    },
    margin: {
        margin: 16,
    },
    input: {
        width: '30%'
    },
    colorPositive: {
        color: `${colors.green.A700} !important`
    },
    colorNegative: {
        color: `${colors.red.A700} !important`
    }
})

const CONNECTED = 'Conectado'
const DESCONNECTED = 'Desconectado'
const CONNECTING = 'Conectando...'
const steps = [ 'Conectar no dispositivo', 'Definir rotas', 'Definir linha e descrição' ]

export default function AddDevice(props) {
    
    const [ step, setActiveStep ] = useState(0)
    const [ status, setStatus ] = useState('Status')
    const [ device, setDevice ] = useState('')
    const classes = styles()
    const dispatch = useDispatch()
    const loading = useSelector(state => state.component.loading)
   
    function tryConnection() {
        if (!props.loading) {
            if (device) {
                dispatch(updateLoading(true))
                setStatus(CONNECTING)
                setTimeout(() => {
                    dispatch(updateLoading(false))
                    setStatus(CONNECTED)        
                }, 3000)
            } else {
                toast.info('Informe o identificador do dispositivo')
            }
        }
    }

    function renderFirstStep() {
        if (step === 0) {
            return (
                <Grid container alignItems="center" justify="center" direction="column" className={clsx(classes.padding, classes.content)}>
                    <h2 className={clsx({ [classes.colorPositive]: status === CONNECTED, [classes.colorNegative]: status === DESCONNECTED })}>{status}</h2>
                    <TextField
                        value={device}
                        onChange={ev => setDevice(ev.target.value)}
                        className={classes.input}
                        variant="outlined"
                        placeholder="Informe identificador do dispositivo"
                        label="Dispositivo"
                    />
                    <Grid>
                        <Fab className={classes.margin} color="primary" variant="extended" onClick={tryConnection}>
                            Conectar
                        </Fab>
                        <Fab disabled={status !== CONNECTED} className={classes.margin} variant="extended" onClick={() => setActiveStep(1)}>
                            Próximo passo
                        </Fab>
                    </Grid>
                </Grid>
            )
        }
        return null
    }

    return (
        <Grid wrap="nowrap" container>
            <Grid container direction="column" wrap="nowrap" className={classes.content}>
                <Stepper activeStep={step}>
                    {
                        steps.map(label => {
                            return (
                                <Step key={label}>
                                    <StepLabel>{ label }</StepLabel>
                                </Step>
                            )
                        })
                    }
                </Stepper>
                {
                    renderFirstStep()
                }
            </Grid>
        </Grid>
    )
}

