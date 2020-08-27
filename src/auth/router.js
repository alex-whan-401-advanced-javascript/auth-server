'use strict';

const express = require('express');
const router = express.Router();
const User = require('./models/users-model');
const basicAuth = require('./middleware/basic');
const oauth = require('./middleware/oauth');

router.post('/signup', async (req, res, next) => {
  const user = await User.create(req.body);
  const token = await user.generateToken();
  // Construct response body with above info
  const responseBody = {
    token,
    user,
  };

  res.send(responseBody);
});

router.post('/signin', basicAuth, async (req, res, next) => {
  res.cookie('basicAuth', req.token);
  res.set('token', req.token);
  // res.status(201).json({ token: req.token, user: req.user });

  res.send({
    token: await req.token,
    user: req.user,
  });
});

router.get('/oauth', oauth, (req, res) => {
  res.status(200).send(req.token);
});

router.get('/users', async (req, res, next) => {
  let recordsToGet = await User.findAll();
  res.status(200).json(recordsToGet);
});

module.exports = router;
