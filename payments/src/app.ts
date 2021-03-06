import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import {errorHandler, notFoundError, currentUser} from '@swstickets/common';
import {createChargeRouter} from './routes/new';

const app = express();
app.set('trust proxy', true); 
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);

app.use(createChargeRouter);

//This will handle any route that doesn't exists
app.all('*', () => {
  throw new notFoundError();
});

app.use(errorHandler);

export { app };