import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {OrderStatus, ExpirationComplete} from '@swstickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import {ExpirationCompleteListener} from '../expiration-complete-listener';
import {Order} from '../../../models/order';
import {Ticket} from '../../../models/ticket';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'gshss',
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const data: ExpirationComplete['data'] = {
    orderId: order.id
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return {ticket, order, listener, data, msg};

};

it('updates the order stats to cancelled', async () => {
  const {listener, order, data, msg} = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an PrderCancelled event', async () => {
  const {listener, order, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});