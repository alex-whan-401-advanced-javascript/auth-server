'use strict';

require('dotenv').config();
require('@code-fellows/supergoose');
const jwt = require('jsonwebtoken');
const User = require('../src/auth/models/users-model');

afterEach(async () => {
  await User.deleteMany({});
});

const fakeUser = {
  username: 'janedoe',
  password: 'password',
  role: 'admin',
  email: 'jane@doe.com',
};

it('should save hashed password', async () => {
  const user = await new User(fakeUser).save();
  expect(user.username).toBe(fakeUser.username);
  expect(user.password).not.toBe(fakeUser.password);
});

it('should authenticate known user', async () => {
  await new User(fakeUser).save();
  const authenticatedUser = await User.authenticateBasic(
    fakeUser.username,
    fakeUser.password
  );
  expect(authenticatedUser).toBeDefined();
});

it('should get null for unknown user when there are none', async () => {
  const authenticatedUser = await User.authenticateBasic('nobody', 'unknown');
  expect(authenticatedUser).toBeNull();
});

it('should get null for unknown user when there are others', async () => {
  await new User(fakeUser).save();
  const authenticatedUser = await User.authenticateBasic('nobody', 'unknown');
  expect(authenticatedUser).toBeNull();
});

it('should return user when password good', async () => {
  const user = await new User(fakeUser).save();
  const comparedUser = await user.comparePassword(fakeUser.password);
  expect(user).toBe(comparedUser);
});

it('should return null when password bad', async () => {
  const user = await new User(fakeUser).save();
  const comparedUser = await user.comparePassword('wrongpassword');
  expect(comparedUser).toBeNull();
});

it('should generate a token', async () => {
  const user = await new User(fakeUser).save();
  const token = await user.generateToken();
  // console.log("TOKEN ******", token);
  expect(token).toBeDefined();
  const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
  expect(verifiedToken.role).toBe(user.role);
});

it('creating an existing user returns user', async () => {
  const user = await new User(fakeUser).save();
  // The THING we want to get back is a user - and we want to make sure it's the CORRECT user with the password/email
  const foundOrCreated = await User.createFromOauth(user.email);

  expect(foundOrCreated.email).toBe(user.email);
  expect(foundOrCreated.password).toBe(user.password);
});

it('creating with email returns new user if not present', async () => {
  const foundOrCreated = await User.createFromOauth('new@new.com');

  expect(foundOrCreated.email).toBe('new@new.com');

  expect(foundOrCreated.password).not.toBe('none'); // means it was actually hashed as part of the save process
  // Check the docs - you'll see that a new user is created with a plain text password of "none" - and we want to make sure it's been hashed (so it shouldn't match the literal string of "none")
  expect(foundOrCreated.username).toBe('new@new.com');
});

it('creating with null email argument is an error', async () => {
  expect.assertions(1); // this checks to make sure an "expect" is actually called and tests aren't just running/looping through the ether

  // We want this Promise Rejection to equal a string of 'Validation Error'
  await expect(User.createFromOauth(null)).rejects.toEqual('Validation Error');
  // Checks what Rejection actually contains (i.e. what error resolves to)
  // More info in Jest docs like "jest test for error in async function"
});
