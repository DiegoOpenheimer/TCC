import React, { useState, useEffect } from 'react'
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
    const [ horary, setHorary ] = useState({ mondayToSaturday: [], sundayAndHoliday: [] })

    useEffect(() => {
      setHorary(old => {
        const newValue = {...old}
        for (const index in props.horary) {
          if (newValue[index]) {
            newValue[index] = [...props.horary[index]]
          }
        }
        return newValue
      })
      return () => setHorary({ mondayToSaturday: [], sundayAndHoliday: [] })
    }, [ props.horary, props.open ])

    function buildChips(filter) {
      return sortHorary(horary[filter]).map((time, index) => {
        return <Chip
          className={classes.chip}
          key={index.toString()}
          label={ time }
          onDelete={() => onDelete(tab === 0 ? 'mondayToSaturday' : 'sundayAndHoliday', index)}
          color="primary"
        />
      })
    }

    function onDelete(filter, index) {
      setHorary(old => {
        const newHorary = {...old}
        newHorary[filter].splice(index, 1)
        return newHorary
      })
    }

    function sortHorary(values) {
      return values.sort((a, b) => Number(a.split(':').join('')) - Number(b.split(':').join('')))
    }

    return (
      <Dialog onClose={() => props.onOpen(false, horary)} fullWidth={true} maxWidth="sm" open={props.open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Definir Horários</DialogTitle>
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
                onChange={(date, time) => {
                  const hour = date.getHours()
                  const minutes = date.getMinutes()
                  const filterDate = tab === 0 ? 'mondayToSaturday' : 'sundayAndHoliday'
                  const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
                  if (horary[filterDate].some(time => time === timeString)) {
                    toast.info('Horário já incluso.', { autoClose: 2000 })
                  } else {
                    setDate(date)
                    setHorary({ ...horary, [filterDate]: sortHorary([...horary[filterDate], timeString]) })
                  }
                }}
                value={date}
            />
          </MuiPickersUtilsProvider>
        </div>
        { buildChips(tab === 0 ? 'mondayToSaturday' : 'sundayAndHoliday') }
      </DialogContent>
      <DialogActions>
          <Button onClick={() => props.onOpen(false)} color="primary">
              Cancelar
          </Button>
          <Button onClick={() => props.onOpen(false, horary)} color="primary">
              Salvar
          </Button>
      </DialogActions>
      </Dialog>
    )
}