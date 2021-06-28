const {Server} = require('socket.io');
const {room_manager} = require('../models/RoomManager');
const passport = require('passport');
const { setup_authentication_commands,
        check_session_auth } = require("./authenticator");


// Helper function to convert express auth-related middleware
// to socket.io middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);


/**
 * Set up the socket.io server.
 * Accepts the http server to listen to messages in,
 * and a session middleware object.
 */
module.exports.setup_server = (server, session) => {
    const io = new Server(server);
    io.use(wrap(session))
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));
    room_manager.set_server(io);
    io.on('connection', (socket) => {
        check_session_auth(socket);
        room_manager.register_manager_commands(socket);
        setup_authentication_commands(socket);
    });
};

