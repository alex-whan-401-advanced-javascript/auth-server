'use strict';

const server = require('./src/server');
require('dotenv').config();
const mongoose = require('mongoose');

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

server.start(process.env.PORT);
