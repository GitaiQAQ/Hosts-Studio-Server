var marked = require("marked");
var async = require('async');
var util = require('util');
var Hosts = require('../proxy/hosts');

exports.new = function(req, res, next) {
    var body = req.body;
    if (req.query.fork) {
        body.fork = req.query.fork;
    };
    Hosts.new(body, function(err, object) {
        if (err) {
            return next(err);
        };
        res.redirect('/console')
    });
}

exports.upload = function(req, res, next) {
    res.render("part/upload", {
        pefix: "http://7xlal5.com1.z0.glb.clouddn.com",
        token: Hosts.token(),
        key: util.format("/hosts/files/%s/%s", AV.User.current()["id"], Date.parse(new Date()))
    });
}

exports.get = function(req, res, next) {
    Hosts.get(req.params.id, function(err, object) {
        if (err) {
            return next(err);
        };
        object.descriptionHTML = marked(object.description);
        res.render("hosts", object);
    });
}

exports.put = function(req, res, next) {
    var body = req.body;
    Hosts.put(req.params.id, body, function(err, object) {
        if (err) {
            return next(err);
        };
        res.redirect('/console');
    });
}
