'use strict';

const express = require('express');
const bearerAuth = require('./src/auth/middleware/bearer');
const router = express.Router();

// add a GET to secret

router.get('/secret', bearerAuth, (req, res) => {
  res.status(200).send('SUCCESS! Access allowed.');
});

module.exports = router;
