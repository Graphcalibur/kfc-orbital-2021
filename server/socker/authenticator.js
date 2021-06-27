
const {User} = require('../models/User');

module.exports.setup_authentication_commands = (socket) => {
    socket.on('login-ws', async (msg) => {
       try {
           socket.user = await User.from_authentication(msg.username, msg.password);
           socket.emit('login-ws-return', socket.user);
       } catch (err) {
            if (User.errors.is_user_error(err)) {
                socket.emit('error', {message: err.message});
            } else {
                console.log("ws server encountered internal server error:  ", err);
                socket.emit('error', {message: "internal server error occured", data: err.name});
            }
       }
    });
    socket.on('logout-ws', (msg) => {
        if (socket.current_room) {
            socket.current_room.kick_user_from_room(socket);
        }
        socket.user = undefined;
    });
    socket.on('check-current-login', (msg) => {
        socket.emit('check-current-login-return', socket.user || null);
    })
};

module.exports.check_session_auth = (socket) => {
    if (socket.handshake.session.user) {
        socket.user = socket.handshake.session.user;
    }
};