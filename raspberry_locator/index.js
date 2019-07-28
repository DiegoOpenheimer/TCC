// const SerialPort = require('serialport')
// const GPS = require('gps')
// let send = true

// const port = new SerialPort('/dev/ttyAMA0', {
//   baudRate: 9200,
// })

// const gps = new GPS

 
// gps.on('data', data => {
//   publishLocation(data)
// })

// port.on('data', data => {
//   gps.updatePartial(data)
// })

// function publishLocation(location) {
//   if (send) {
//     send = false
//     setTimeout(() => {
//       console.log('try to send location', location)
//       send = true
//     }, 5000)
//   }
// }

const si = require('systeminformation')

si.system(result => {
  const mqtt = require('mqtt')
  const TOPIC_PING = result.uuid + '/ping'
  const TOPIC_PONG = result.uuid + '/pong'
  const CLIENT_ID = 'mqtt_rasp' + Math.random().toString(16).substr(2, 8)

  const client = mqtt.connect('mqtt://localhost:1883', { username: 'TCC', password: 'TCC', clientId: CLIENT_ID })
  client.subscribe(TOPIC_PING)
  client.on('connect', () => console.log('connected'))
  client.on('reconnect', () => console.log('reconnect'))
  client.on('disconnect', () => console.log('disconnected'))
  client.on('error', (e) => console.log('error', e))
  client.on('offline', () => console.log('offline'))

  client.on('message', (topic, message) => {
    if (topic === TOPIC_PING && message.toString() === 'ping') {
      client.publish(TOPIC_PONG, 'pong')
    }
  })
})
