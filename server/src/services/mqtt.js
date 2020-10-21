const mqtt = require('mqtt')
const Device = require('../model/device')
const logger = require('../utils/logger')

module.exports = function() {
    const CLIENT_ID = 'mqtt_rasp' + Math.random().toString(16).substr(2, 8)
    const client = mqtt.connect('mqtt://' + process.env.MQTT, { username: 'TCC', password: 'TCC', clientId: CLIENT_ID })
    client.subscribe('#')
    client.on('connect', () => console.log('connected mqtt'))

    client.on('message', onMessage)
}

function onMessage(topic, message) {
    try {
        if (topic.endsWith('/location')) {
            const id = topic.split('/')[0]
            updateDeviceLocation(id, JSON.parse(message.toString()))
        }
    } catch {}
}

function updateDeviceLocation(uuid, payload) {
    Device.findOneAndUpdate({ uuid }, { latitude: payload.lat, longitude: payload.lon })
    .catch(e => logger.error(`Fail to update device ${e}`))
}