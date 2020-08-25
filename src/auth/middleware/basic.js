'use strict';

// Basic Authentication Middleware

const base64 = require('base-64');
const users = require('../models/users-model');

// Reads the encoded username and password from the Authentication header
module.exports = async (req, res, next) => {
  // can declare it all async
  // Checks the Users model to see if this is a valid user and the right password
  if (!req.headers.authorization) {
    next('Invalid Login!!!');
    return;
  }

  // Basic abcdefjlk - the below code will pull out "abcdefjlk"
  let encodedPair = req.headers.authorization.split(' ').pop();

  // Decodes to user:pass and splits it to an array
  // Decoding piece we split off from "Basic abcdefjkl" above
  const decoded = base64.decode(encodedPair); // will end up with somehing like "someuser:somepass" as a valid combo
  // console.log('DECODED FORM: ------------', decoded);
  let [username, password] = decoded.split(':'); // splitting "someuser:somepass" into ['someuser', 'somepass']

  // If the user is valid, generate a token and append it to the request object
  // AuthenticateBasic is a method of USERS - and USERS is whatever came back from the required schema above
  // Let's change this from old-school promise structure to async/await
  try {
    const validUser = await users.authenticateBasic(username, password);

    req.token = users.generateToken(validUser);
    req.user = username;
    next();
  } catch (err) {
    next({
      message: 'Invalid User ID/Password',
      status: 401,
      statusMessage: 'Unauthorized',
    });
  }

  // return (
  //   users // need to have a "return" here to indicate to Jest that it's async and it needs to get the promise back - even with the await - can use async/await instead to help with this
  //     .authenticateBasic(user, pass)
  //     .then(validUser => {
  //       console.log('VALID USER???', validUser);
  //       req.token = users.generateToken(validUser);
  //       req.user = user;
  //       // If valid, call next()
  //       next();
  //     })
  //     // Otherwise, call next() with an error as an argument
  //     .catch(err => {
  //       console.error(
  //         '************************* ERROR *************************'
  //       );
  //       next({
  //         message: 'Invalid User ID/Password',
  //         status: 401,
  //         statusMessage: 'Unauthorized',
  //       });
  //     })
  // );
};
