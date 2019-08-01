import React, { useState } from 'react'
import { Grid, Stepper, Step, StepLabel } from '@material-ui/core'
import FirstStep from './firstStep'
import SecondStep from './secondStep'
import styles from './style'

const steps = [ 'Conectar no dispositivo', 'Associar com uma linha' ]

export default function AddDevice() {
    
    const [ controller, setController ] = useState({ step: 0, device: null })
    const classes = styles()

    return (
        <Grid wrap="nowrap" container>
            <Grid container direction="column" wrap="nowrap" className={classes.content}>
                <Stepper activeStep={controller.step}>
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
                    controller.step === 0 && <FirstStep finishProccess={device => setController({ ...controller, step: 1, device })} />
                }
                {
                    controller.step === 1 && <SecondStep device={controller.device} />
                }
            </Grid>
        </Grid>
    )
}

