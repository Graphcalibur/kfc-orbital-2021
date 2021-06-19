const {Server} = require('socket.io');
const {manager} = require('../models/RoomManager');

module.exports.setup_server = server => {
    const io = new Server(server);
    io.on('connection', (socket) => {
        console.log("Connection made!");
        manager.register_room_commands(socket);
    });
};

