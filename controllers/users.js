var async = require('async');
var Users = require('../proxy/users');
var Hosts = require('../proxy/hosts');

exports.profile = function(req, res, next) {
    return res.json(AV.User.current());
}

exports.get = function(req, res, next) {
    var getUser = function(callback) {
        Users.get(req.params.id, callback);
    };
    var getProject = function(user, callback) {
        Hosts.findByUser(req.params.id, false, true, 0, function(err, project) {
            callback(err, user, project);
        });
    };
    async.waterfall([getUser, getProject], function(err, user, project) {
        if (err) {
            return next(err);
        }
        res.render("profile", {
            User: user,
            Hosts: project
        });
    });
}
