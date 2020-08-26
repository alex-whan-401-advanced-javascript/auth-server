'use strict';

const superagent = require('superagent');
const users = require('../models/users-model');

const tokenServerUrl = 'https://github.com/login/oauth/access_token';
const remoteAPI = 'https://api.github.com/user';
const API_SERVER = 'http://localhost:3000/oauth';

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Create a new middleware module called oauth.js in your auth module’s middleware folder

module.exports = async function authorize(req, res, next) {
  try {
    let code = req.query.code;
    console.log('(1) CODE: ', code);
  } catch (error) {
    next(`ERROR: ${error.message}`);
  }
};

// This should be required by your auth router and attached inline to the /oauth route:
// app.get('/oauth', OAuthMiddleware, ...)
// This middleware will need to do the following:
// Exchange the code received on the initial request for a token from the Provider
// Use the token to retrieve the user’s account information from the Provider
// Create/Retrieve an account from our Mongo users database matching the user’s account (email or username) using the users model
// Generate a token using the users model
// Add the token and the user record to the request object
// If it is successful, use next() to continue on to the actual route handler
// If not, the middleware should invoke the error handler by calling next() with an error
