'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { use } = require('../router');
require('dotenv').config();

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

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
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
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
};

users.statics.createFromOauth = async function (email) {
  if (!email) {
    return Promise.reject('Validation Error');
  }

  const user = await this.findOne({ email });

  if (user) {
    return user;
  } else {
    return this.create({ username: email, password: 'none', email: email });
  }
};

module.exports = mongoose.model('users', users);
