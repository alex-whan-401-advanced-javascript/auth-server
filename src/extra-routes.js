'use strict';

const express = require('express');
const bearerAuth = require('./auth/middleware/bearer');
const router = express.Router();
const permissions = require('./auth/middleware/acl');

// router.get('/secret', bearerAuth, (req, res) => {
//   res.status(200).send('SUCCESS! Access granted.');
// });

// Where needed, we pass in the desired "permission" to the ACL middleware - which then matches it to the desire "capability"/CRUD ability in the User Model
router.get('/public', routeHandler);
router.get('/private', bearerAuth, routeHandler);
router.get('/readonly', bearerAuth, permissions('read'), routeHandler);
router.post('/create', bearerAuth, permissions('create'), routeHandler);
router.post('/update', bearerAuth, permissions('update'), routeHandler);
router.post('/delete', bearerAuth, permissions('delete'), routeHandler);

function routeHandler(req, res) {
  res.status(200).send('SUCCESS! Access granted.');
}

module.exports = router;
