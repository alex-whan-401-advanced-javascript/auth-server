// Bearer Auth "puts a token on the request"
// 'Very VERY similar to what was in the demo'
// How much demo code can we use? How close is it?

'use strict';

const User = require('../models/users-model');

module.exports = async (req, res, next) => {
  // we have access to req.headers because we have a req (although not all reqs will have authorization - lets make sure it does, and if it doesn't get outta there)
  if (!req.headers.authorization) {
    next('Invalid Login: MISSING HEADERS!');
    return;
  }

  let token = req.headers.authorization.split(' ').pop();

  // Catching errors from user model
  // This is authenticateToken's job - to resolve asynchronously to a VALID USER
  User.authenticateToken(token)
    .then(validUser => {
      req.user = validUser;
      next();
    })
    .catch(err => next('Invalid Login!'));
};

// Where does this token come from??
// This is the token we got by running through that manual process of hitting GitHub, getting it back, and having it show up on the screen
// No easily AUTOMATED process for this - only a MANUAL one (like we're doing - going and clicking on the page)
