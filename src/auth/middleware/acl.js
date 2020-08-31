'use strict';

// Grabs the desired capability from the route, and returns the matching middleware that's aware of it
module.exports = capability => {
  return (req, res, next) => {
    console.log('USER: ', req.user);

    // Previous middleware should have put the user object on the request object at this point - and now we can inspect/check the capabilities (try/catch prevents us having to go deeper)
    try {
      if (req.user.capability.includes(capability)) {
        next();
      } else {
        next('ACCESS DENIED!');
      }
    } catch (error) {
      next('INVALID LOGIN!');
    }
  };
};
