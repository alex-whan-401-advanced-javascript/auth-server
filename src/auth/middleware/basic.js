'use strict';

const base64 = require('base-64');
const users = require('../models/users-model');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login!!!');
    return;
  }

  const errorObj = {
    message: 'Invalid User ID/Password',
    status: 401,
    statusMessage: 'Unauthorized',
  };

  let encodedPair = req.headers.authorization.split(' ').pop();

  const decoded = base64.decode(encodedPair);
  let [user, pass] = decoded.split(':');

  try {
    const validUser = await users.authenticateBasic(user, pass);
    req.token = validUser.generateToken();
    req.user = user;
    next();
  } catch (err) {
    next(errorObj);
  }
};
