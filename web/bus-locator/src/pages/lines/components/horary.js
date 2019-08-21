import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tab, Tabs, Chip, makeStyles } from '@material-ui/core'
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { toast } from 'react-toastify'
import DateFnsUtils from "@date-io/date-fns"

const createStyles = makeStyles(theme => ({
  chip: {
    margin: theme.spacing(1)
  }
}))

export default function(props) {

    const classes = createStyles()
    const [ tab, setTab ] = useState(0)
    const [ date, setDate ] = useState(new Date())
    const [ times, setTimes ] = useState([])


    function buildChips() {
      return times.map((time, index) => {
        return <Chip
          className={classes.chip}
          key={index.toString()}
          label={ `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}` }
          onDelete={() => onDelete(index)}
          color="primary"
        />
      })
    }

    function onDelete(index) {
      setTimes(old => {
        const newTimes = [...old]
        newTimes.splice(index, 1)
        return newTimes
      })
    }

    return (
      <Dialog onClose={() => props.onOpen(false)} fullWidth={true} maxWidth="sm" open={props.open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Atenção</DialogTitle>
      <DialogContent>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(_, newValue) => setTab(newValue)}
          centered
        >
          <Tab label="Segunda - Sábado" />
          <Tab label="Domingo e feriados" />
        </Tabs>
        <div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker
                okLabel="Ok"
                cancelLabel="Cancelar"
                margin="normal"
                label="Horário de saída"
                onChange={date => {
                  const hour = date.getHours()
                  const minutes = date.getMinutes()
                  if (times.some(time => time.getHours() === hour && time.getMinutes() === minutes)) {
                    toast.info('Horário já incluso.', { autoClose: 2000 })
                  } else {
                    setDate(date)
                    setTimes([ ...times, date ])
                  }
                }}
                value={date}
            />
          </MuiPickersUtilsProvider>
        </div>
        { buildChips() }
      </DialogContent>
      <DialogActions>
          <Button onClick={() => props.onOpen(false)} color="primary">
              Cancelar
          </Button>
          <Button onClick={props.onConfirm} color="primary">
              Salvar
          </Button>
      </DialogActions>
      </Dialog>
    )
}