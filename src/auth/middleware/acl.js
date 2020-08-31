'use strict';

module.exports = capability => {
  return (req, res, next) => {
    console.log('USER: ', req.user);

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
