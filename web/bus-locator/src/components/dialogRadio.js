import React from 'react'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'


export default function(props) {
  const {
      onClose,
      value: valueProp,
      open,
      options,
      title,
      textCancel,
      textConfirm,
      ...other
  } = props
  const [value, setValue] = React.useState(valueProp)
  const radioGroupRef = React.useRef(null)

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp)
    }
  }, [valueProp, open])

  function handleEntering() {
    if (radioGroupRef.current !== null) {
      radioGroupRef.current.focus();
    }
  }

  function handleCancel() {
    onClose()
  }

  function handleOk() {
    onClose(value)
  }

  function handleChange(event, newValue) {
    setValue(newValue)
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="ringtone"
          name="ringtone"
          value={value || ''}
          onChange={handleChange}
        >
          {options.map((option, index) => (
            <FormControlLabel value={option._id} key={index.toString()} control={<Radio />} label={`${option.number} - ${option.description}`} />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          { textCancel }
        </Button>
        <Button onClick={handleOk} color="primary">
          { textConfirm }
        </Button>
      </DialogActions>
    </Dialog>
  )
}
