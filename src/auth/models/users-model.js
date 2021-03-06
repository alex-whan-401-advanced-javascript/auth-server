/* eslint-disable indent */
'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
// const { use } = require('../router');
require('dotenv').config();

// Create a Users Mongoose model/schema in the auth system
const users = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'editor', 'writer', 'user'],
  },
  capabilities: { type: Array, required: true, default: [] },
});

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  let role = this.role;

  if (this.isModified('role')) {
    switch (role) {
      case 'admin':
        this.capabilities = ['create', 'read', 'update', 'delete'];
        break;
      case 'editor':
        this.capabilities = ['create', 'read', 'update'];
        break;
      case 'writer':
        this.capabilities = ['create', 'read'];
        break;
      case 'user':
        this.capabilities = ['read'];
        break;
    }
  }
});

users.statics.authenticateBasic = async function (username, password) {
  let query = { username };
  const user = await this.findOne(query);
  return user && (await user.comparePassword(password));
};

users.methods.comparePassword = async function (password) {
  const passwordMatch = await bcrypt.compare(password, this.password);
  return passwordMatch ? this : null;
};

users.methods.generateToken = async function () {
  const payload = {
    id: this._id,
    role: this.role,
    capabilities: this.capabilities,
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
};

users.statics.createFromOauth = async function (username) {
  if (!username) {
    return Promise.reject('Validation Error');
  }

  const user = await this.findOne({ username });

  if (user) {
    console.log(`Welcome back, ${user.username}!`);
    return user;
  } else {
    console.log('Creating new user...');
    let password = 'therealestpassword';
    return this.create({ username, password });
  }
};

// users.authenticateToken will be a STATIC - because we need to ask the whole collection for it
// Asking like: Do we have this token already in our database?
users.statics.authenticateToken = async function (token) {
  // Use JWT library to validate it with the secret - if valid, look up user by the ID in the TOKEN and return it
  // Otherwise, return the error
  let tokenObject = jwt.verify(token, process.env.JWT_SECRET);

  // Look up user by ID in the token
  return await this.findById(tokenObject.id);

  // if (foundUser) {
  //   return foundUser;
  // } else {
  //   // user not found? throw a "user not found" error
  //   // Any errors happening up above here should bubble out - not try/catch needed
  //   throw new Error('*** USER NOT FOUND ***');
  // }
};

module.exports = mongoose.model('users', users);
