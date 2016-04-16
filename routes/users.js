var express = require('express');
var router = express.Router();
var Users = require('../controllers/users');

router.get('/profile', Users.profile)

router.get('/:id', Users.get)

module.exports = router;
