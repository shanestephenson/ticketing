import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';
import {Ticket} from '../../models/ticket';
import {Order, OrderStatus} from '../../models/order';
import {natsWrapper} from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  //create a ticket with ticket model
  const ticket = Ticket.build({
  id: mongoose.Types.ObjectId().toHexString(),
  title: 'sug',
  price: 10
  });

  await ticket.save();

  const user = global.signin();

  //make a requet to cancel the order
  const {body: order} = await request(app)
  .post('/api/orders')
  .set('Cookie', user)
  .send({ticketId: ticket.id})
  .expect(201);

  await request(app)
  .delete(`/api/orders/${order.id}`)
  .set('Cookie', user)
  .expect(204);

  //expectation to make sure the thin is cancelled
  const updateOrder = await Order.findById(order.id);

  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'sug',
    price: 10
    });
  
    await ticket.save();
  
    const user = global.signin();
  
    //make a requet to cancel the order
    const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201);
  
    await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});