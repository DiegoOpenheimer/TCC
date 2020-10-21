import { connect } from 'mqtt'

const clientId = 'mqtt_rasp' + Math.random().toString(16).substr(2, 8)

const client = connect(process.env.MQTT, { username: 'TCC', password: 'TCC', clientId })

client.on('connect', () => console.log('connected'))
client.on('reconnect', () => console.log('reconnect'))
client.on('disconnect', () => console.log('disconnected'))
client.on('error', (e) => console.log('error', e))
client.on('offline', () => console.log('offline'))

export default client