import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';


//Need to tell TS there is a global variable called signin
declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}

let mongo: any;

//hook that runs before all tests
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

//hook that runs before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

//hook that after all tests
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

//global function
global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
  .post('/api/users/signup')
  .send({
    email, password
  }) 
  .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
