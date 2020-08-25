'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

const secret = process.env.SECRET;

// Create a Users Mongoose model/schema in the auth system
const users = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['admin', 'editor', 'user'],
  },
});

// Add save function - need to return a value or a promise rejection?
// users.save = async function (record) {
//   if (!db[record.username]) {
//     record.password = await bcrypt.hash(record.password, 5);

//     db[record.username] = record;

//     return record;
//   }

//   return Promise.reject();
// };

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
users.methods.generateToken = function () {
  const token = jwt.sign({ username: this.username, secret });
  return token;
};

module.exports = mongoose.model('users', users);
