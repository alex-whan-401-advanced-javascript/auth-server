'use strict';

const express = require('express');
require('dotenv').config();
const app = express();
const authRouter = require('../src/auth/router');

// Global Middleware
app.use(express.json());

// Routes
app.use(authRouter);

module.exports = {
  server: app,
  start: port => {
    const PORT = port || 3000;
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  },
};
