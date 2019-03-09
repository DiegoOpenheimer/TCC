const SerialPort = require('serialport');
const GPS = require('gps');

const port = new SerialPort('/dev/ttyAMA0', {
  baudRate: 9200,
});

const gps = new GPS;
 
gps.on('data', function(data) {
  console.log(data, gps.state);
});
 
port.on('data', function(data) {
  gps.updatePartial(data);
});
