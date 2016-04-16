var util = require("util");
var Hosts = require('../proxy/hosts');
var Configs = require('../proxy/configs');

exports.updata_android = function(req, res, next) {
    Configs.get("55d546aa00b0de09cff3bd39", function(err, data) {
        var cache = req.Cache.save(data, {
            expire: {
                h: 1
            }
        });
        return res.json(cache);
    })
}

exports.upload_token = function(req, res, next) {
    var token = Hosts.tokenRaw();
    res.send(token ? token : 401);
}

exports.project_public = function(req, res, next) {
    Hosts.public(false, false, 0, function(err, object) {
        if (err) {
            return next(err);
        };
        return res.json(object);
    })
}

exports.project_private = function(req, res, next) {
    Hosts.private(false, 0, function(err, object) {
        if (err) {
            return next(err);
        };
        return res.json(object);
    })
}

exports.hosts_new = function(req, res, next) {
    var body = req.body;
    if (!body.url) {
        return new Error(401);
    };
    if (req.query.fork) {
        body.fork = req.query.fork;
    };
    Hosts.new(body, function(err, object) {
        if (err) {
            return next(err);
        };
        return res.json(object);
    });
};

exports.hosts_get = function(req, res, next) {
    Hosts.get(req.params.id, function(err, object) {
        if (err) {
            return next(err);
        };
        return res.json(object);
    });
};

exports.hosts_del = function(req, res, next) {
    Hosts.del(req.params.id, function(err, object) {
        if (err) {
            return next(err);
        };
        return res.json(object);
    });
}

exports.hosts_down = function(req, res, next) {
    Hosts.get(req.params.id, function(err, object) {
        if (err) {
            return next(err);
        };
        return res.redirect(object.url);
    });
}

exports.changyan_profile = function(req, res, next) {
    var data = {
        "is_login": 0
    };

    if (AV.User.current()) {
        data.is_login = 1;
        var user = {};
        user.img_url = 'https://cdn.v2ex.com/gravatar/' + encode.md5(AV.User.current().get('email')) + '?size=256&d=retro&f=y';
        user.nickname = AV.User.current().get('username');
        user.profile_url = '/user/' + AV.User.current()["id"];
        user.user_id = AV.User.current()["id"];
        user.sign = encode.Hmacsha1(util.format('img_url=%s&nickname=%s&profile_url=%s&user_id=%s', user.img_url, user.nickname, user.profile_url, user.user_id), "98cb015048ff5e1445580dcd08c6ee1e");
        data.user = user;
    };

    return res.send(util.format("%s(%s)", req.query.callback || "callback", JSON.stringify(data)));
}

exports.changyan_logout = function(req, res, next) {
    AV.User.logOut();
    var data = {
        "code": 1,
        "reload_page": 1
    };
    return res.send(util.format("%s(%s)", req.query.callback || "callback", JSON.stringify(data)));
}

//TODO:
exports.changyan_push_back = function(req, res, next) {
    var body = req.body;
    console.log(body);
}

exports.login = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    AV.User.logIn(username, password, {
        success: function(user) {
        	var out = user.toJSON();
        	out["maxAge"] = req.sessionOptions.maxAge;
            res.json(out);
        },
        error: function(user, err) {
            res.json(err);
        }
    })
}

exports.register = function(req, res, next) {
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var user = new AV.User();
    user.set("email", email);
    user.set("username", username);
    user.set("password", password);
    user.signUp(null, {
        success: function(user) {
            res.json(user.toJSON());
        },
        error: function(user, err) {
            res.json(err);
        }
    })
}

exports.logout = function(req, res, next) {
    AV.User.logOut();
    return res.json({});
}
