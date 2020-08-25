'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
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
// Can modify a specific instance of a user
users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Create a method in the schema to authenticate a user using the hashed password
// STATICS are available to the collection as a whole
users.statics.authenticateBasic = async function (username, password) {
  // "COLLECTION-LEVEL CONCERN" - not just asking "Alex" - asking the "collection"? - ask JB again

  // username is grabbed and put into a query object
  let query = { username };
  // find one with THAT query
  return (
    this.findOne(query)
      // if it finds it, something happens, and if it doesn't the console.error happens (presumably)
      .then(user => {
        // console.log('USER: .........', user);
        return user && user.comparePassword(password); // add a return? - NEED a return here because ES6 fat arrow functions can return undefined by default?
      })
      .catch(console.error)
  );
};

// METHODS only available to individual instantiations of the collections
// STATICS are available to the collection as a whole
// Methods TIE a function to an instance - and are implicitly already calling a function ON a particular instance
users.methods.comparePassword = function (plainPassword, password) {
  console.log('PLAIN PASSWORD: ', plainPassword);
  console.log('PASSWORD: ', this.password);

  return (
    bcrypt
      // compares string variable with stored variable password
      .compare(plainPassword, this.password)
      .then(valid => (valid ? this : null))
  );
};

// Create a method in the schema to generate a Token following a valid login
// Remember: This is A COLLECTION LEVEL thing - but SHOULD it be a STATIC?
// Need to be talking about a PARTICULAR user, NOT the collection
users.methods.generateToken = function () {
  // console.log('generateToken user: ', users.username);
  // console.log('SECRET: ', process.env.SECRET);
  // console.log('USERS:::', users);
  // console.log('THIS.USERNAME', this.username);
  // Look at the .sign() signature!!
  const token = jwt.sign({ username: users.username }, process.env.SECRET);
  console.log('******** GOT HERE BABY! *******');
  return token;
};

module.exports = mongoose.model('users', users);
