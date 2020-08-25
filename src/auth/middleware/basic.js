'use strict';

// Basic Authentication Middleware

const base64 = require('base-64');
const users = require('../models/users-model');

// Reads the encoded username and password from the Authentication header
module.exports = (req, res, next) => {
  // Checks the Users model to see if this is a valid user and the right password
  if (!req.headers.authorization) {
    next('Invalid Login!!');
    return;
  }

  let basic = req.headers.authorization.split(' ').pop();

  let [user, pass] = base64.decode(basic).split(':');

  // If the user is valid, generate a token and append it to the request object
  users
    .authenticateBasic(user, pass)
    .then(validUser => {
      req.token = users.generateToken(validUser);
      // If valid, call next()
      next();
    })
    // Otherwise, call next() with an error as an argument
    .catch(err => next('Invalid Login!!'));
};
