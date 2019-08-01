const SerialPort = require('serialport')
const GPS = require('gps')
const mqtt = require('mqtt')
let send = true

const si = require('systeminformation')

si.uuid(result => {
  const TOPIC_PING = result.os + '/ping'
  const TOPIC_PONG = result.os + '/pong'
  const TOPIC_LOCATION = result.os + '/location'
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
  main(client, TOPIC_LOCATION)
})

function main(client, topic) {

  const port = new SerialPort('/dev/ttyAMA0', {
    baudRate: 9200,
    autoOpen: false
  })
  
  const gps = new GPS
  
  port.open(err => {
    if (err) {
      console.log('Fail to open port')
    }
  })
   
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
        client.publish(topic, location)
        send = true
      }, 5000)
    }
  }
}
