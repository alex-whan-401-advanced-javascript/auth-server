'use strict';

const express = require('express');
require('dotenv').config();
const app = express();
const userRouter = require('../src/auth/router');

// Global Middleware
app.use(express.json());
app.use(userRouter);

module.exports = {
  server: app,
  start: port => {
    const PORT = port || 3000;
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  },
};
