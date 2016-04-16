var express = require('express');
var router = express.Router();
var util = require("util");

var API = require('../controllers/api');

router.get('/upload/token', API.upload_token);

router.get('/updata/android', API.updata_android);

router.get('/project/public', API.project_public);

router.get('/project/private', API.project_private);

router.post('/hosts', API.hosts_new)

router.get('/hosts/:id', API.hosts_get);

router.get('/hosts/:id/del', API.hosts_del);

router.get('/hosts/:id/down', API.hosts_down);

router.get('/changyan/profile', API.changyan_profile)

router.get('/changyan/logout', API.changyan_logout)

router.post('/changyan/push_back', API.changyan_push_back)

router.post('/login', API.login)

router.post('/register', API.register)

router.get('/logout', API.logout)
module.exports = router;
