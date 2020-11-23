import nats from 'node-nats-streaming';
import {randomBytes} from 'crypto';
import {TicketCreatedListener} from './events/ticket-created-listener';

console.clear();


const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  //Chaining the additional methhod calls to the options object is quite specific to NATS
  new TicketCreatedListener(stan).listen();

});

//These are watching for interrupt or terminate siganls (CTRL + C) we will close down our client first. Tellling NATS not to send any more messages. 
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());


