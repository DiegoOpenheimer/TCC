const SerialPort = require('serialport');
console.log(SerialPort.Readline)
const port = new SerialPort('/dev/ttyAMA0', { // change path
  baudRate: 9200,
});
 
var GPS = require('gps');
var gps = new GPS;
 
gps.on('data', function(data) {
  console.log(data, gps.state);
});
 
port.on('data', function(data) {
  gps.updatePartial(data);
});