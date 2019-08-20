import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tab, Tabs } from '@material-ui/core'
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from "@date-io/date-fns"

export default function(props) {

    const [ tab, setTab ] = useState(0)
    const [ date, setDate ] = useState(new Date())

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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardTimePicker
              okLabel="Ok"
              cancelLabel="Cancelar"
              margin="normal"
              label="Horário de saída"
              onChange={date => setDate(date)}
              value={date}
          />
        </MuiPickersUtilsProvider>
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