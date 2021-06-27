const sharedsession = require("express-socket.io-session");
const {Server} = require('socket.io');
const {room_manager} = require('../models/RoomManager');
const { setup_authentication_commands,
        check_session_auth } = require("./authenticator");

/**
 * Set up the socket.io server.
 * Accepts the http server to listen to messages in,
 * and a session middleware object.
 */
module.exports.setup_server = (server, session) => {
    const io = new Server(server);
    io.use(sharedsession(session, {
        autoSave: true
    }));
    room_manager.set_server(io);
    io.on('connection', (socket) => {
        check_session_auth(socket);
        room_manager.register_manager_commands(socket);
        setup_authentication_commands(socket);
    });
};

