// 'use strict';

// process.env.SECRET = 'muysecreto';

// const jwt = require('jsonwebtoken');
// require('dotenv').config();
// const server = require('../src/server').server;
// const supergoose = require('@code-fellows/supergoose');

// const mockRequest = supergoose(server);

// describe('Auth Router', () => {
//   describe(`users signup/in`, () => {
//     it('can sign up', async () => {
//       const userData = {
//         username: 'admin',
//         password: 'password',
//         role: 'admin',
//         email: 'admin@admin.com',
//       };

//       const results = await mockRequest.post('/signup').send(userData);

//       expect(results.statusCode).toBe(201);
//     });

//     it('can signin with basic', async () => {
//       const userData = {
//         username: 'joey',
//         password: 'password',
//         role: 'admin',
//         email: 'admin@admin.com',
//       };

//       await mockRequest.post('/signup').send(userData);

//       const results = await mockRequest
//         .post('/signin')
//         .auth('joey', 'password');

//       let parsedToken = JSON.parse(results.text).token;
//       const token = jwt.verify(parsedToken, process.env.SECRET);

//       expect(token).toBeDefined();
//     });

//     it.skip('can fail signin with bad password', async () => {
//       const userData = {
//         username: 'joey',
//         password: 'password',
//         role: 'admin',
//         email: 'admin@admin.com',
//       };

//       await mockRequest.post('/signup').send(userData);

//       const results = await mockRequest
//         .post('/signin')
//         .auth('joey', 'badpassword');

//       expect(results.statusCode).toBe(401);
//     });

//     it.skip('can fail signin with unknown user', async () => {
//       const userData = {
//         username: 'joey',
//         password: 'password',
//         role: 'admin',
//         email: 'admin@admin.com',
//       };

//       await mockRequest.post('/signup').send(userData);

//       const results = await mockRequest
//         .post('/signin')
//         .auth('nobody', 'password');

//       expect(results.statusCode).toBe(401);
//     });
//   });
// });

'use strict';

require('dotenv').config();

const jwt = require('jsonwebtoken');

const { server } = require('../src/server');

// Alternatively:
// const server = require("../../../src/app.js").server;

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
        console.log('RESULTS?????', token);

        id = token.id;
        expect(token.id).toBe(id);

        expect(token.role).toBe(userType);
      });
    });
  });
});
