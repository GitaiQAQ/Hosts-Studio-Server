var crypto = require('crypto');
var util = require('util');

var Cache = require('cache-storage');
var MemoryStorage = require('cache-storage/Storage/MemorySyncStorage');
var cacheMod = new Cache(new MemoryStorage(), 'dphdjy');

function sha1(text) {
    var shasum = crypto.createHash('sha1');
    shasum.update(text);
    var d = shasum.digest('hex');
    return d.toString('base64');
}

module.exports = function cache(req, res, next) {
    var path = "path:" + req._parsedUrl.pathname.replace(/[\\\/]/g, "");
    console.log(path);
    path = sha1(path);

    var Cache = {
        path: path,
        save: function(data, opt) {
            return cacheMod.save(path, data, opt);
        },
        data: cacheMod.load(path)
    };

    if (Cache.data != null) {
        logger.log("Cache %s %s", req._parsedUrl.pathname, path);

        if (req.query && req.query.clear) {
            cacheMod.remove(path);
            return res.send(util.format("Cache clear: %s",req._parsedUrl.pathname));
        };

        return res.send(Cache.data);
    };
    req.Cache = Cache;
    next();
}