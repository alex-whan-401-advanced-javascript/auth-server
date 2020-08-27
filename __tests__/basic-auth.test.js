'use strict';

require('dotenv').config();
require('@code-fellows/supergoose');
const auth = require('../src/auth/middleware/basic');
const User = require('../src/auth/models/users-model');

beforeAll(async () => {
  // Making this "admin data" available for everyone "beforeAll/beforeEach"
  // Could also just put this object/data IN each test
  const adminUserData = {
    username: 'admin',
    password: 'password',
    role: 'admin',
    email: 'ad@min.com',
  };
  await User(adminUserData).save();
});

describe('user authentication', () => {
  let errorObject = {
    message: 'Invalid User ID/Password',
    status: 401,
    statusMessage: 'Unauthorized',
  };

  it('fails a login for a user (admin) with the incorrect basic credentials', async () => {
    // admin:foo: YWRtaW46Zm9v

    let req = {
      // supplying credentials for text
      headers: {
        authorization: 'Basic YWRtaW46Zm9v',
      },
    };

    let res = {};

    let next = jest.fn(); // using Jest to set up a special kind of function that will report on "how it was used and in what ways", basically

    await auth(req, res, next);

    expect(next).toHaveBeenCalledWith(errorObject); // this is how we defined "what it means for this to work" - needs to have the exact/particular error object above
  });

  it('logs in an admin user with the right credentials', async () => {
    // admin:password: YWRtaW46cGFzc3dvcmQ=

    let req = {
      headers: {
        authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
      },
    };

    let res = {};

    let next = jest.fn();

    await auth(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});
