import React, { useState, useEffect } from 'react'
import { Grid, Stepper, Step, StepLabel, makeStyles, TextField, Fab, colors } from '@material-ui/core'
import { updateLoading } from '../../../redux/components/action'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import clsx from 'clsx'
import client from '../../../services/mqtt'
import { timer } from 'rxjs'

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
const DISCONNECTED = 'Desconectado'
const CONNECTING = 'Conectando...'
const steps = [ 'Conectar no dispositivo', 'Associar com uma linha' ]
let subscription

export default function AddDevice(props) {
    
    const [ step, setActiveStep ] = useState(0)
    const [ status, setStatus ] = useState('Status')
    const [ device, setDevice ] = useState({ text: '', topic: '' })
    const classes = styles()
    const dispatch = useDispatch()
    const loading = useSelector(state => state.component.loading)

    useEffect(() => {
        return () => {
            client.removeListener('message', onMessage)
            client.unsubscribe(device.topic)
            dispatch(updateLoading(false))
            if (subscription) {
                subscription.unsubscribe()
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [  ])
   
    function tryConnection() {
        if (!loading) {
            if (device) {
                client.subscribe(device.topic)
                client.publish(device.text.concat('/ping'), 'ping')
                client.addListener('message', onMessage)
                subscription = timer(10000).subscribe(() => {
                    client.unsubscribe(device.topic)
                    dispatch(updateLoading(false))
                    setStatus(DISCONNECTED)
                })
                dispatch(updateLoading(true))
                setStatus(CONNECTING)
                
            } else {
                toast.info('Informe o identificador do dispositivo')
            }
        }
    }

    function onMessage(topic, message) {
        if (topic === device.topic && message.toString() === 'pong') {
            client.unsubscribe(device.topic)
            dispatch(updateLoading(false))
            setStatus(CONNECTED)
            subscription.unsubscribe()
        }
    }

    function renderFirstStep() {
        if (step === 0) {
            return (
                <Grid container alignItems="center" justify="center" direction="column" className={clsx(classes.padding, classes.content)}>
                    <h2 className={clsx({ [classes.colorPositive]: status === CONNECTED, [classes.colorNegative]: status === DISCONNECTED })}>{status}</h2>
                    <TextField
                        disabled={loading}
                        value={device.text}
                        onChange={ev => setDevice({...device, text: ev.target.value, topic: ev.target.value + '/pong'})}
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

