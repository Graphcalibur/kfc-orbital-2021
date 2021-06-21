const {Server} = require('socket.io');
const {room_manager} = require('../models/RoomManager');

module.exports.setup_server = server => {
    const io = new Server(server);
    io.on('connection', (socket) => {
        room_manager.register_manager_commands(socket);
    });
};

