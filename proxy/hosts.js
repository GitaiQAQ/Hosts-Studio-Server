var Hosts = AV.Object.extend('hosts');
var util = require('util');

exports.private = function(full, skip, callback) {
    var query = new AV.Query(Hosts);
    query.include('author');
    query.include('fork');

    query.descending('updatedAt');
    if (!full) {
        query.notEqualTo("display", false);
    };
    if (AV.User.current()) {
        query.equalTo("author", AV.User.current());
    }
    query.limit(20);
    query.skip(skip||0);

    query.find({
        success: function(object) {
            callback(null, ObjectToJSON(object));
        },
        error: function(object, err) {
            callback(err, object);
        }
    })
}

exports.public = function(lock, full, skip, callback) {
    var query = new AV.Query(Hosts);
    query.include('author');
    query.include('fork');

    query.descending('updatedAt');
    query.equalTo("lock", lock||false);
    if (!full) {
        query.notEqualTo("display", false);
    };
    query.limit(20);
    query.skip(skip||0);

    query.find({
        success: function(object) {
            callback(null, ObjectToJSON(object));
        },
        error: function(object, err) {
            callback(err, object);
        }
    })
}

exports.findByUser = function(id, lock, full, skip, callback) {
    var user = new AV.User();
    user.id = id;

    var query = new AV.Query(Hosts);
    query.include('author');
    query.include('fork');

    query.descending('updatedAt');
    query.equalTo("lock", lock||false);
    if (!full) {
        query.notEqualTo("display", false);
    };

    if (user) {
        query.equalTo("author", user);
    }
    query.limit(20);
    query.skip(skip||0);

    query.find({
        success: function(object) {
            callback(null, ObjectToJSON(object));
        },
        error: function(object, err) {
            callback(err, object);
        }
    })
}

exports.new = function(body, callback) {
    if (body.lockStr==="lock") {
        body.lock = true;
    };
    var hosts = new Hosts();
    if (AV.User.current()) {
        var acl = new AV.ACL(AV.User.current());
        acl.setPublicReadAccess(true);
        hosts.setACL(acl);
    }
    hosts.set("title", body.title);
    if((body.url.indexOf("http://7xlal5.com1.z0.glb.clouddn.com")>=0)&& (body.url.indexOf("http://7xlal5.com1.z0.glb.clouddn.com/@")<0)){
        hosts.set("url", body.url.replace("7xlal5.com1.z0.glb.clouddn.com","7xlal5.com1.z0.glb.clouddn.com/@"));
    }else{
        hosts.set("url", body.url);
    }

    hosts.set("description", body.description);
    if (body.lock) {
        hosts.set("lock", true);
    } else {
        hosts.set("lock", false);
    };

    if (body.fork) {
        hosts.set('fork', AV.Object.createWithoutData("hosts", body.fork));
    };

    if (AV.User.current()) {
        hosts.set('author', AV.User.current());
    }
    hosts.save(null, {
        success: function(object) {
            callback(null, ObjectToJSON(object));
        },
        error: function(object, err) {
            callback(err, object);
        }
    });
}

exports.get = function(id, callback) {
    var query = new AV.Query(Hosts);
    query.include('author');
    query.include('fork');
    query.get(id, {
        success: function(object) {
            callback(null, ObjectToJSON(object));
        },
        error: function(object, err) {
            callback(err, object);
        }
    });
}

exports.put = function(id, body, callback) {
    var query = new AV.Query(Hosts);
    query.include('author');
    query.include('fork');
    query.get(id, {
        success: function(hosts) {
            hosts.set("title", body.title);
            hosts.set("url", body.url);
            if (body.lock) {
                hosts.set("lock", true);
            } else {
                hosts.set("lock", false);
            };

            hosts.set("description", body.description);
            hosts.save(null, {
                success: function(object) {
                    callback(null, ObjectToJSON(object));
                },
                error: function(object, err) {
                    callback(err, object);
                }
            });
        },
        error: function(object, err) {
            callback(err, object);
        }
    });
}

exports.del = function(id, callback) {
    /*if (!AV.User.current()) {
        return callback({ code: 1,message: 'Forbidden to delete by class permissions.' });
    }*/
    var hosts = AV.Object.createWithoutData("hosts", id);
    hosts.destroy({
        success: function(object) {
            callback(null, ObjectToJSON(object));
        },
        error: function(object, err) {
            callback(err, object);
        }
    });
}

exports.token = function(callback) {
    var qiniu = require('qiniu');
    qiniu.conf.ACCESS_KEY = Config.qiniu_ak;
    qiniu.conf.SECRET_KEY = Config.qiniu_sk;
    var putPolicy = new qiniu.rs.PutPolicy("hosts");
    putPolicy.returnUrl = Config.qiniu_returnUrl||(Config.host+"/hosts/upload");
    return (AV.User.current() ? putPolicy.token() : null);
}

exports.tokenRaw = function(callback) {
    var qiniu = require('qiniu');
    qiniu.conf.ACCESS_KEY = Config.qiniu_ak;
    qiniu.conf.SECRET_KEY = Config.qiniu_sk;
    var putPolicy = new qiniu.rs.PutPolicy("hosts");
    return (AV.User.current() ? putPolicy.token() : null);
}

function ObjectToJSON(object) {
    var backObj;
    if (object instanceof Array) {
        backObj = [];
        for (var i = 0; i < object.length; i++) {
            backObj.push(ObjectToJSON(object[i]));
        };
    } else if (object instanceof Object) {
        backObj = object.toJSON ? object.toJSON() : object;
        for (var n in object.attributes) {
            var obj = object.attributes[n];
            if (obj instanceof AV.Object) {
                backObj[n] = obj.toJSON();
            };
        };
    }
    return backObj;

}
