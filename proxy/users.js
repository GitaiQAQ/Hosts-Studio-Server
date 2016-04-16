exports.get = function(id, callback) {
    var query = new AV.Query(AV.User);
    query.get(id, {
        success: function(object) {
            callback(null, object.toJSON());
        },
        error: function(object, err) {
            callback(err, object);
        }
    });
}