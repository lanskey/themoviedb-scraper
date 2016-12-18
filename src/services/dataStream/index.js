var events = require('events');
var eventEmitter = new events.EventEmitter();

var ringBell = function ringBell()
{
  console.log('no to zajebiscie stary, teraz mozemy je zapisac albo uruchomic ta funkcje raz jeszcze');
}

eventEmitter.on('dataDownloaded', ringBell)



module.exports = eventEmitter