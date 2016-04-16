var Feedback = AV.Object.extend('feedback');
var util = require('util');

exports.get = function(status, type, skip, callback) {
    var query = new AV.Query(Feedback);
    query.include('author');

    query.descending('updatedAt');

    if(status != "all"){
    	if(status){
    	query.equalTo("status", status);
	    }else{
	    	query.equalTo("status", "close");
	    }
    }
    if(type != "all"){
    	if(type){
	    	query.equalTo("type", type);
	    }
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

exports.new = function(type, title, des, callback) {
    var feedbacks = new Feedback();
    feedbacks.set("status","open");
    feedbacks.set("type",type);
    feedbacks.set("title",title);
    feedbacks.set("des",des);

    if (AV.User.current()) {
        var acl = new AV.ACL(AV.User.current());
        acl.setPublicReadAccess(true);
        feedbacks.setACL(acl);
        feedbacks.set('author', AV.User.current());
    }

    feedbacks.save(null, {
        success: function(object) {
            callback(null, ObjectToJSON(object));
        },
        error: function(object, err) {
            callback(err, object);
        }
    });
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
