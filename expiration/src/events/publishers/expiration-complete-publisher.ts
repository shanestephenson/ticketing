import {Subjects, Publisher, ExpirationComplete} from '@swstickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationComplete>{
subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}