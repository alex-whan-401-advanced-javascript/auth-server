'use strict';

require('dotenv').config();

const { server } = require('../src/server');

const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server);

describe.skip('Extra routes tests', () => {
  it('should allow entry with good token', async () => {
    // Can be convenient to store a TEST_TOKEN in environment
    // But you will have to refresh it (aka grab a new one) if/when it expires
    const response = await mockRequest
      .get('/secret')
      .auth(process.env.TEST_TOKEN, { type: 'bearer' });
    expect(response.status).toBe(200);
  });

  it('should NOT allow entry with bad token', async () => {
    const response = await mockRequest
      .get('/secret')
      .auth('bad token', { type: 'bearer' });
    expect(response.status).toBe(500);
  });
});
