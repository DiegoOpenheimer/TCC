const SerialPort = require('serialport')
const GPS = require('gps')
const mqtt = require('mqtt')
let send = true
let currentLocation = { lat: '', lon: '', time: '' }
const si = require('systeminformation')
si.uuid(result => {
  console.log(result)
  const TOPIC_PING = result.os + '/ping'
  const TOPIC_PONG = result.os + '/pong'
  const TOPIC_LOCATION = result.os + '/location'
  const CLIENT_ID = 'mqtt_rasp' + Math.random().toString(16).substr(2, 8)
  const client = mqtt.connect('mqtt://ec2-18-228-196-51.sa-east-1.compute.amazonaws.com:1883', { username: 'TCC', password: 'TCC', clientId: CLIENT_ID })
  client.subscribe(TOPIC_PING)
  client.on('connect', () => console.log('connected'))
  client.on('reconnect', () => console.log('reconnect'))
  client.on('disconnect', () => console.log('disconnected'))
  client.on('error', (e) => console.log('error', e))
  client.on('offline', () => console.log('offline'))
  client.on('message', (topic, message) => {
    if (topic === TOPIC_PING && message.toString() === 'ping') {
      console.log(currentLocation)
      client.publish(TOPIC_PONG, JSON.stringify(currentLocation))
    }
  })
  main(client, TOPIC_LOCATION)
})
function main(client, topic) {
  const port = new SerialPort('/dev/ttyAMA0', {
    baudRate: 9600,
    autoOpen: false
  })
  
  const gps = new GPS
  
  port.open(err => {
    if (err) {
      console.log('Fail to open port')
    }
  })
   
  gps.on('data', data => {
    if (data && 'lon' in data && 'lat' in data) {
      currentLocation = data
      publishLocation()
    }
  })
  
  port.on('data', data => {
    try {
      gps.updatePartial(data)
    } catch(e) {
      console.log('Error to parse data', e)
    }
  })
  
  function publishLocation() {
    if (send) {
      send = false
      setTimeout(() => {
        client.publish(topic, JSON.stringify(currentLocation))
        send = true
      }, 5000)
    }
  }
}