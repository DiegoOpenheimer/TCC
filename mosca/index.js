const Mosca = require('mosca')
const user = 'TCC'
const pass = 'TCC'
const settings = {
    port: 1883,
    http: {
        port: 9001,
        bundle: true
    }
}

const server = new Mosca.Server(settings)

server.on('clientConnected', client => {
    console.log('Client connected', client.id)
})

server.on('published', (packet, client) => {
    console.log('Published', packet.payload.toString())
})

server.on('ready', () => console.log('Mosca server is up and running'))

function authenticate(client, username, password, callback) {
    let result = false
    if(user === username && pass === password.toString()) {
        result = true
    }
    callback(null, result)
}

server.authenticate = authenticate
