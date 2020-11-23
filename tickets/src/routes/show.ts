import express, {Request, Response} from 'express';
import {notFoundError} from '@swstickets/common'
import {Ticket} from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if(!ticket){
    throw new notFoundError();
  }

  res.send(ticket);
});

export {router as showTicketRouter};