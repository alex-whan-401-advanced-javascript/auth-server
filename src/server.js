'use strict';

const express = require('express');
require('dotenv').config();
const app = express();
const authRouter = require('../src/auth/router');
const notFound = require('../src/middleware/404');
const errorHandler = require('../src/middleware/500');

// Global Middleware
app.use(express.static('./public'));
app.use(express.json());

// Routes
app.use(authRouter);

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
