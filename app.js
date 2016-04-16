'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();
var cloud = require('./cloud');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('build'));

// 加载云代码方法
app.use(cloud);

var sessionKey = "eh" + require('package')("./").version;
app.use(AV.Cloud.CookieSession({
    secret: Config.secret,
    maxAge: 7*24*60*60*1000,
    fetchUser: true,
    name: sessionKey
}));

// 强制使用 https
//app.use(AV.Cloud.HttpsRedirect());

app.use(methodOverride('_method'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(require('./libs/cache'));

app.use('/', require("./routes"));
app.use('/users', require("./routes/users"));
app.use('/hosts', require("./routes/hosts"));
app.use('/api', require("./routes/apis"));

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.format({
            text: function() {
                res.send(err.message);
            },
            html: function() {
                res.render('error', {
                    status:err.status,
                    message: err.message,
                    error: err
                });
            },
            json: function() {
                res.send(err);
            }
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.format({
        text: function() {
            res.send(err.message);
        },
        html: function() {
            res.render('error', {
                status:err.status,
                message: err.message
            });
        },
        json: function() {
            res.send(err);
        }
    });
});

module.exports = app;
