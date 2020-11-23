import request from 'supertest'; 
import { app } from '../../app';
import { signupRouter } from '../signup';

//super test by default does not manage cookies and will not be included in the follow up request. 
//we need to take the cookie and add it to follow up requests
it('resonds with details about the current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
  .get('/api/users/currentuser')
  .set('Cookie', cookie)
  .send()
  .expect(200);

  //console.log(response.body);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});


it('resonds with null if not authenticated', async () => {
  const response = await request(app)
  .get('/api/users/currentuser')
  .send()
  .expect(200);

  expect(response.body.currentUser).toEqual(null);
});