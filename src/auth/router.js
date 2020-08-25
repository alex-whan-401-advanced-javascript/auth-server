'use strict';

const express = require('express');
const router = express.Router();
const auth = require('./middleware/basic');

router.post('/signup', (req, res, next) => {});

router.post('/signin', auth, (req, res, next) => {});
