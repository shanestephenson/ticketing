import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

//Need to tell TS there is a global variable called signin
declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

//USE fake/mocked NATS Client 
jest.mock('../nats-wrapper');

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
  jest.clearAllMocks();
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
global.signin = () => {
  //build a JWT payload {id, email}

  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  //Create the JWT! 
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session object. {jwt: MY_JWT}
  const session = {jwt: token};

  //turn that session in to JSON
  const sessionJSON = JSON.stringify(session); 

  //take JSON and encode it as base 64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with he encoded data
  return [`express:sess=${base64}`];
};
