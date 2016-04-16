var Hosts = require('./proxy/hosts');
var Users = [];
module.exports = function(server) {
    var IO = require('socket.io')(server);
    IO.on('connection', function(socket) {
        socket.on('login', function(username) {
            socket.username = username;
            socket.userIndex = Users.length;
            Users.push(username);
            socket.broadcast.emit('login', socket.username, Users.length);
        });

        socket.on('Hosts', function(act, data, cb) {
            if (act === "new") {
                Hosts.new(data.body, cb);
            } else if (act === "get") {
                Hosts.get(data.id, cb);
            } else if (act === "put") {
                Hosts.put(data.id, data.body, cb);
            } else if (act === "del") {
                Hosts.del(data.id, cb);
            }
        });

        socket.on('disconnect', function() {
            logger.log('logout', socket.username);
            Users.splice(socket.userIndex, 1);
            socket.broadcast.emit('logout', socket.username, Users.length);
        });
    });
}
