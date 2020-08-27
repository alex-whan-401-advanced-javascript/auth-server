'use strict';

require('dotenv').config();

const jwt = require('jsonwebtoken');

const { server } = require('../src/server');

const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server);

process.env.SECRET = 'muysecreto';

let users = {
  // We do need to make sure we have different TYPES of users
  // It'll run these checks for each of these TYPES of users (3 user types x 2 tests each)
  admin: { username: 'admin', password: 'password', role: 'admin' },
  editor: { username: 'editor', password: 'password', role: 'editor' },
  user: { username: 'user', password: 'password', role: 'user' },
};

describe('Auth Router', () => {
  Object.keys(users).forEach(userType => {
    describe(`${userType} users`, () => {
      let id;

      it('can create one', async () => {
        const results = await mockRequest.post('/signup').send(users[userType]);

        expect(results.body.user).toBeDefined();
        expect(results.body.token).toBeDefined();

        const token = jwt.verify(results.body.token, process.env.JWT_SECRET);

        id = token._id;
        expect(token.id).toBeDefined();

        expect(token.role).toBe(userType);
      });

      it('can signin with basic', async () => {
        const { username } = users[userType];
        const { password } = users[userType];

        const results = await mockRequest
          .post('/signin')
          .auth(username, password);

        const token = jwt.verify(results.body.token, process.env.JWT_SECRET);

        id = token.id;
        expect(token.id).toBe(id);

        expect(token.role).toBe(userType);
      });
    });
  });
});
