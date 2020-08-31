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

  try {
    const validUser = await User.authenticateToken(token);

    req.user = validUser;

    // req.user = {
    //   username: validUser.username,
    //   fullname: validUser.fullname,
    //   email: validUser.email,
    //   capabilities: validUser.capabilities,
    // };

    next();
  } catch (err) {
    next('INVALID LOGIN!');
  }
};

// Where does this token come from??
// This is the token we got by running through that manual process of hitting GitHub, getting it back, and having it show up on the screen
// No easily AUTOMATED process for this - only a MANUAL one (like we're doing - going and clicking on the page)
