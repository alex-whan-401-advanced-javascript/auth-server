'use strict';

const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const authRouter = require('../src/auth/router');
const extraRouter = require('./extra-routes');
const notFound = require('../src/middleware/404');
const errorHandler = require('../src/middleware/500');

// Global Middleware
app.use(cors());
app.use(express.static('./public'));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRouter);
app.use(extraRouter); // For Lab 13

// Catchalls/Errors
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    const PORT = port || 3000;
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  },
};
