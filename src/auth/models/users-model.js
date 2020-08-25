'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Create a Users Mongoose model/schema in the auth system
const users = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, required: true },
  // role: {
  //   type: String,
  //   required: true,
  //   default: 'user',
  //   enum: ['admin', 'editor', 'user'],
  // },
});

// Before we save a record:
// Hash the plain text password given before you save a user to the database
users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Create a method in the schema to authenticate a user using the hashed password
users.statics.authenticateBasic = async function (username, password) {
  let query = { username };
  return this.findOne(query)
    .then(user => {
      user && user.comparePassword(password);
    })
    .catch(console.error);
};

users.methods.comparePassword = function (plainPassword, password) {
  return bcrypt
    .compare(plainPassword, password)
    .then(valid => (valid ? this : null));
};

// Create a method in the schema to generate a Token following a valid login
users.methods.generateToken = function () {};

module.exports = mongoose.model('users', users);
