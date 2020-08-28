'use strict';

const express = require('express');
const bearerAuth = require('./auth/middleware/bearer');
const router = express.Router();

router.get('/secret', bearerAuth, (req, res) => {
  res.status(200).send('SUCCESS! Access allowed.');
});

module.exports = router;
