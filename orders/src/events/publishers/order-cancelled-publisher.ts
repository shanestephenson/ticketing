import {Publisher, OrderCancelledEvent, Subjects} from '@swstickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}