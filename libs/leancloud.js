var request = require('request');

var LC_ROOT = "https://leancloud.cn";
var LC_VERSION = "1.1";
var LC_APP_ID = "sgyqr6wbvjgvlwwsntucqv7ip3q6gxfi30bxdgb9ui8ttxgs";
var LC_APP_KEY = "g1ivn87jykoqk5o05bi6edw8uyqveix1af66n0dt68xkk70q";
var LC_APP_MASTER_KEY = "27amqhc8h3vttlq3s36v623m0gwgmhdg6qx6g6xs3hw8jpdb";

var tableMap = {
    "config": "config",
    "hosts": "hosts"
}

request = request.defaults({
    headers: {
        'X-AVOSCloud-Application-Id': LC_APP_ID,
        'X-AVOSCloud-Application-Key': LC_APP_KEY
    },
    timeout: 1500
})


exports.batch = function(data, cb) {
    var path = LC_ROOT + '/' + LC_VERSION + '/batch';
    var t = _.now();
    data.forEach(function(n) {
        if (!n.method) {
            n.method = "GET"
        };
        if (n.path && n.path.length > 0) {
            n.path = "/" + LC_VERSION + "/classes/" + n.path;
        };
    })
    logger.log("LC_BATCH: %s", path, data);
    request.post({
        url: path,
        body: {
            "requests": data
        },
        json: true
    }, function(e, res, body) {
        logger.log("LC_BATCH: %s %sms", path, _.now() - t);
        if (!e) {
            return cb(null, body);
        }
        cb(e, body);
    });
};

exports.batchwithClass = function(clazz, data, cb) {
    var path = LC_ROOT + '/' + LC_VERSION + '/batch';
    data.forEach(function(n) {
        if (n.path && n.path.length > 0) {
            n.path = tableMap[clazz];
        };
    })
    this.batch(data, cb);
};

exports.batchFrom = function(clazz, data, cb) {
    var path = LC_ROOT + '/' + LC_VERSION + '/batch';
    data.forEach(function(n) {
        if (n.path && n.path.length > 0) {
            n.path = tableMap[clazz] + "/" + n.path;
        };
    })
    this.batch(data, cb);
};

/*
 * 读取
 */

exports.get = function(apipath, query, cb) {
    var path = LC_ROOT + '/' + LC_VERSION + '/' + apipath;
    var t = _.now();
    request({
        url: path,
        qs: query,
        json: true
    }, function(e, res, body) {
        if (!e && !body.error) {
            logger.log("LC_GET: %s %sms", path, _.now() - t);
            return cb(null, body);
        }
        logger.log("LC_GET: %s %s %sms", path, JSON.stringify(query), _.now() - t);
        cb(e, body);
    });
};

/*
 * 创建
 */

exports.post = function(apipath, data, cb) {
    var path = LC_ROOT + '/' + LC_VERSION + '/' + apipath;
    var t = _.now();
    logger.log(data);
    request.post({
        url: path,
        body: data,
        json: true
    }, function(e, res, body) {
        logger.log("LC_POST:%s %sms", path, _.now() - t);
        if (!e) {
            return cb(null, body);
        }
        cb(e, body);
    });
};

/*
 * 修改
 */

exports.put = function(apipath, data, cb) {
    logger.log("LC_PUT:" + '/' + apipath);
    var path = LC_ROOT + '/' + LC_VERSION + '/' + apipath;
    request.put({
        url: path,
        body: data,
        json: true
    }, function(e, res, body) {
        logger.log("LC_PUT:%s %sms", path, _.now() - t);
        if (!e) {
            return cb(null, body);
        }
        cb(e, body);
    });
};

/*
 * 得到对象
 */

exports.getObj = function(clazz, id, cb) {
    this.get("classes/" + tableMap[clazz] + "/" + id, "", cb);
};

/*
 * 修改对象
 */

exports.putObj = function(clazz, id, data, cb) {
    this.put("classes/" + tableMap[clazz] + "/" + id, data, cb);
};

/*
 * 得到一列数据
 */

exports.getList = function(clazz, where, limit, skip, order, include, keys, cb) {
    if (!_.isString(where)) {
        where = _.extend({
            display: true
        }, where);
        where = JSON.stringify(where);
    };
    this.get("classes/" + tableMap[clazz], {
        where: where,
        limit: limit,
        skip: skip,
        order: order,
        count: 1,
        include: include,
        keys: "-ACL%2C-createdAt" + keys
    }, cb);
};

/*exports.cloudQuery = function(clazz, cql, cb) {
    this.get("cloudQuery", {
        cql: encodeURI("select * from " + tableMap[clazz] + " where " + cql)
    }, function(e, body) {
        if (!e) {
           return cb(null.results);
        }
        cb(e, body);
    })
};*/

exports.search = function(clazz, keywords, limit, fields, sid, highlights, order, cb) {
    this.get("search/select", {
        "sid": sid,
        "q": keywords,
        "limit": limit,
        "fields": fields,
        "highlights": highlights,
        "order": order,
        "clazz": tableMap[clazz]
    }, cb)
};

/*
{"where":{"introduction":{"$regex":"疯狂天才"}},"limit":20,"order":"-updatedAt","_method":"GET","_ApplicationId":"9fehyfelxythe54ynrwsy1m0cx2ht0437ka468jhe1pa7ann","_ApplicationKey":"fg51xd7cdlv51oz1c6ddafllpquwryeaahu8l4zqhl1cthpd"}
exports.search1 = function(clazz, keywords, limit, fields, sid, highlights, order, cb) {
    this.post(clazz, {
        "where":{"introduction":{"$regex":"\\Q疯狂天才\\E"}},
        "limit":20,
        "order":"-updatedAt",
        "_method":"GET",
        "_ApplicationId":"9fehyfelxythe54ynrwsy1m0cx2ht0437ka468jhe1pa7ann",
        "_ApplicationKey":"fg51xd7cdlv51oz1c6ddafllpquwryeaahu8l4zqhl1cthpd"
    }, cb)
};
*/

exports.getOne = function(clazz, where, include, keys, cb) {
    this.getList(clazz, where, 2, 0, "", include, keys, function(e, body) {
        if (!e) {
            var d = body.results;
            if (d && d.length > 0) return cb(null, d[0]);
        }
        cb(e, body);
    })
};


exports.feedback = function(status, content, contact, cb) {
    this.post("feedback", {
        "status": status || "open",
        "content": content,
        "contact": contact
    }, function(e, body) {
        if (!e) {
            return cb(null, body);
        }
        cb(e, body);
    })
};

exports.getFeedbacks = function(where, limit, skip, order, include, keys, cb) {
    this.get("feedback", {
        where: where,
        limit: limit,
        skip: skip,
        order: order,
        count: 1,
        include: include,
        keys: "-ACL%2C-createdAt%2C-updatedAt" + keys
    }, cb);
};

exports.getFeedback = function(id, cb) {
    this.get("feedback/" + id, "", cb);
};

exports.postThread = function(id, type, attachment, content, cb) {
    this.get("feedback/" + id + "/threads", {
        "type": type,
        "attachment": attachment,
        "content": content
    }, cb);
};

exports.getThreads = function(id, cb) {
    this.get("feedback/" + id + "/threads", "", cb);
};

//threads
/*
 * 注册用户
 */

/*
exports.signin = function*(username, password, phone, email, avatar) {
    this.post("users", {
        username: username,
        password: password,
        phone: phone,
        email: email,
        avatar: avatar
    }, cb);
}
*/


/*
 * 用户登录
 */

/*
exports.login = function*(ue, pw) {
    var d = yield this.post("login", {
        username: ue,
        password: pw
    });
    return d;
}
*/
/*
exports.getConf = function*(id) {
    var d = yield this.getObj("config", id);
    return eval(d.data)
};

exports.putConf = function*(id, data) {
    var d = yield this.putObj("config", id, data);
    return eval(d.data)
};
*/
