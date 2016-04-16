var Configs = AV.Object.extend('config');

/*exports.get = function(id, callback) {
    var query = new AV.Query(Configs);
    query.get(id, {
        success: function(object) {
            callback(null, object.toJSON().data);
        },
        error: function(object, err) {
            callback(err, object);
        }
    });
}*/

exports.get = function(id, callback) {
    var query = new AV.Query(Configs);
    query.get(id, {
        success: function(object) {
            callback(null, object.toJSON().data);
        },
        error: function(object, err) {
            callback(err, object);
        }
    });
}