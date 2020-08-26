'use strict';

const server = require('./src/server');
require('dotenv').config();
const mongoose = require('mongoose');

// index.js and server.js should be created with standard express server scaffolding

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

// Connect the server to a Mongo database
mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

server.start(process.env.PORT);
