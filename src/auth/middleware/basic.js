'use strict';

const base64 = require('base-64');
const users = require('../models/users-model');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login!!!');
    return;
  }

  let encodedPair = req.headers.authorization.split(' ').pop();

  const decoded = base64.decode(encodedPair);
  let [username, password] = decoded.split(':');

  try {
    const validUser = await users.authenticateBasic(username, password);

    req.token = validUser.generateToken();
    console.log('REQ TOKEN  ________', req.token);
    req.user = username;
    next();
  } catch (err) {
    next({
      message: 'Invalid User ID/Password',
      status: 401,
      statusMessage: 'Unauthorized',
    });
  }
};
