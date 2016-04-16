var async = require('async');

var marked = require("marked");

var Hosts = require('../proxy/hosts');
var Feedback = require('../proxy/feedback');
var Configs = require('../proxy/configs');

exports.index = function(req, res, next) {
    Hosts.public(false, false, 0, function(err, pubHosts) {
        if (err) {
            return next(err);
        }
        res.render("index", {
            pubHosts: pubHosts
        });
    });
}

exports.login = function(req, res, next) {
    var cb = req.query.cb;
    try {
        cb = JSON.parse(cb);
        cb = cb.message;
    } catch (e) {}
    res.render('users/login', {
        title: '用户登录',
        cb: cb
    });
}

exports.register = function(req, res, next) {
    var cb = req.query.cb;
    try {
        cb = JSON.parse(cb);
        cb = cb.message;
    } catch (e) {}
    res.render('users/register', {
        title: '用户注册',
        cb: cb
    });
}

exports.act_login = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    AV.User.logIn(username, password, {
        success: function(user) {
            res.redirect('/console');
        },
        error: function(user, err) {
            res.redirect('/login?cb=' + JSON.stringify(err));
        }
    })
}

exports.act_register = function(req, res, next) {
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    if (!email || email.trim().length == 0 || !username || username.trim().length == 0 || !password || password.trim().length == 0) {
        return res.redirect('/register?cb=Email,用户名或密码不能为空');
    }
    var user = new AV.User();
    user.set("email", email);
    user.set("username", username);
    user.set("password", password);
    user.signUp(null, {
        success: function(user) {
            res.redirect('/console');
        },
        error: function(user, err) {
            res.redirect('/register?cb=' + JSON.stringify(err));
        }
    })
}

exports.logout = function(req, res, next) {
    AV.User.logOut();
    return res.redirect('/login');
}

exports.publish = function(req, res) {
    Configs.get("55d576c100b0987028b029f3", function(err, data) {
        res.render('app', data, function(err, html) {
            if (!err) {
                var cache = req.Cache.save(html, {
                    expire: {
                        h: 1
                    }
                });
                return res.send(cache);
            };
        });
    })
}

exports.feedback = function(req,res,next){
    var query = req.query;
    var status, type, skip;
    if (query) {
        status=query.status||null;
        type=req.params.type||query.type||null;
        skip=query.skip||0;
    };
    Feedback.get(status, type, skip,function(err, data){
        if (err) {
            return next(err);
        }
        for (var i = 0; i < data.length; i++) {
            var feedback = data[i];
            if (feedback.des) {
                feedback.desHtml = marked(feedback.des);
            };
            if (feedback.answer) {
                feedback.answerHtml = marked(feedback.answer);
            };
            data[i] = feedback;
        };
        res.render('feedback', {
            "type":type,
            "feedbacks":data
        }, function(err, html) {
            if (err) {
                return next(err);
            }
            /*var cache = req.Cache.save(html, {
                expire: {
                    M: 1
                }
            });*/
            return res.send(html);
        });
    })
}

exports.act_feedback = function(req,res,next){
    if (!AV.User.current()) {
        res.redirect('/login')
    };
    var body = req.body;
    var type, title, des;
    if (body) {
        title=body.title;
        des=body.des;
        type=body.type||null;
    };
    Feedback.new(type, title, des, function(err, data){
        if (err) {
            return next(err);
        }
        res.redirect('/help')
    });
}

exports.console = function(req, res, next) {
    if (!AV.User.current()) {
        res.redirect('/login')
    };
    var myProject = function(callback) {
        Hosts.private(true, 0, callback);
    };
    var pubProject = function(my, callback) {
        Hosts.public(false, false, 0, function(err, pub) {
            callback(err, my, pub);
        });
    };
    async.waterfall([myProject, pubProject], function(err, myHosts, pubHosts) {
        if (err) {
            return next(err);
        }
        res.render("console", {
            myHosts: myHosts,
            pubHosts: pubHosts
        });
    });
}
