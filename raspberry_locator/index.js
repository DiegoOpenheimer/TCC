const SerialPort = require('serialport')
const GPS = require('gps')
let send = true

const port = new SerialPort('/dev/ttyAMA0', {
  baudRate: 9200,
})

const gps = new GPS

 
gps.on('data', data => {
  publishLocation(data)
})

port.on('data', data => {
  gps.updatePartial(data)
})

function publishLocation(location) {
  if (send) {
    send = false
    setTimeout(() => {
      console.log('try to send location', location)
      send = true
    }, 5000)
  }
}