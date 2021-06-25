const { Server } = require("socket.io");
const { room_manager } = require("../models/RoomManager");
const { setup_authentication_commands } = require("./authenticator");

module.exports.setup_server = (server) => {
  const io = new Server(server);
  io.on("connection", (socket) => {
    room_manager.register_manager_commands(socket);
    setup_authentication_commands(socket);
  });
};
