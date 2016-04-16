var express = require('express');
var router = express.Router();
var Hosts = require('../controllers/hosts');

router.post('/', Hosts.new);

router.get('/upload', Hosts.upload);

router.get('/:id', Hosts.get);

router.post('/:id', Hosts.put);
module.exports = router;
