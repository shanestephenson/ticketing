import {Subjects, Publisher, PayemntCreatedEvent} from '@swstickets/common';

export class PaymentCreatedPublisher extends Publisher<PayemntCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}