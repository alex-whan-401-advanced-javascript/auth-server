'use strict';
// Create a Users Mongoose model/schema in the auth system

// Before we save a record:

// Hash the plain text password given before you save a user to the database

// Create a method in the schema to authenticate a user using the hashed password

// Create a method in the schema to generate a Token following a valid login

const mongoose = require('mongoose');

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

module.exports = mongoose.model('users', users);
