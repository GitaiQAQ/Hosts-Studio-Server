require('tingyun')
'use strict';

global.Config = require('./config.js');
global.AV = require('leanengine');
global.logger = require('tracer').colorConsole({
    format: "[{{timestamp}}]" + " <{{title}}> " + "{{message}}" + " ({{file}}:{{line}})",
    dateformat: "HH:MM:ss",
    transport: function(data) {
        console.log(data.output);
    }
});


global.encode = require('./libs/encode');
global.moment = require('moment');
global.package = require('package')("./");

var AV = require('leanengine');
var fs = require('fs');
var APP_ID = process.env.LC_APP_ID || Config.av_app_id;
var APP_KEY = process.env.LC_APP_KEY || Config.av_app_key;
var MASTER_KEY = process.env.LC_APP_MASTER_KEY || Config.av_master_key;
AV.initialize(APP_ID, APP_KEY, MASTER_KEY);
// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();
AV.Promise._isPromisesAPlusCompliant = false;

var http = require('http'),
    app = require('./app');

/*var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};*/

var server = http.createServer(app);
var PORT = parseInt(process.env.LC_APP_PORT || Config.port);
server.listen(PORT, function() {
    logger.log('Server is running, port:', PORT);
});

/*var ttyjs = require('tty.js');

var tty = ttyjs.createServer({
  shell: 'bash',
  users: {
    dphdjy: 'dphdjy'
  },
  port: PORT
});
tty.use("EH",app);
tty.listen();*/


var io = require('./websocket')(server);

server.on('error', function(err) {
    if (err.code === 'EADDRINUSE') {
        logger.error('Server address in use, exiting...');
        process.exit(0);
    } else {
        throw err;
    }
});
