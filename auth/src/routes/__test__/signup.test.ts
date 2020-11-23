import request from 'supertest'; //fakes HTTP requests (not HTTPS)
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
}); 

it('returns a 400 with an invalid email', async () => {
  return request(app)
  .post('/api/users/signup')
  .send({
    email: 'uyjgshs',
    password: 'password'
  })
  .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
  .post('/api/users/signup')
  .send({
    email: 'uyjgshs',
    password: 'p'
  })
  .expect(400);
});

//Can add multiple requests to one test
it('returns a 400 with missing email and password', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com'
  })
  .expect(400);

  return request(app)
  .post('/api/users/signup')
  .send({password: "[ass"})
  .expect(400);
});


it('duplicate emails are not allowed', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: "password"
  })
  .expect(201);

  return request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: "password"
  })
  .expect(400);
});

it('sets a cookie after a successful signup', async () => {
  const response = await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();

});