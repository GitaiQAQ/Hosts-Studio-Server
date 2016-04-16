var express = require('express');
var router = express.Router();
var Site = require('../controllers/site');

router.get('/', Site.index);

router.get('/login', Site.login)

router.post('/login', Site.act_login)

router.get('/register', Site.register);

router.post('/register', Site.act_register)

router.get('/logout', Site.logout)

router.get('/publish', Site.publish);

router.get('/help', Site.feedback);

router.get('/help/:type', Site.feedback);

router.post('/help', Site.act_feedback);

router.get('/console', Site.console);
module.exports = router;
