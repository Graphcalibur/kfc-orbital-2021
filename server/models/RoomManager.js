const random = require('../utils/random');
const { GuestUser } = require('./User');
const { Game } = require('./Game');
const { CodeSnippet } = require('./CodeSnippet');

const socketio_room_name = (room_code) => {
    return `game_room:${room_code}`;
};

// Static strings for ready states
const READY = 'Ready';
const NOT_READY = 'Not Ready';

class Room {
    /* Constructs a Room.
     * Options:
     *  - room_code: the code this room will be known under.
     */
    constructor(options) {
        this.io = options.io;
        this.room_code = options.room_code;
        this.players = []; // Each element is an object {user: User, sock: socket}
        this.ready_state = {}; // Object with usernames as key, and ready state as value
        this.manager = options.manager;
        this.current_game = null;
        this.visibility = options.visibility;
    }
    /*
     * Check if the room is empty.
     * Returns a boolean that is true iff the room is empty.
     */
    is_empty() {
        return this.players.length === 0;
    }
    get is_public() {
        return this.visibility === "public";
    }
    /* Return an array denoting the current ready/not ready
     * status of the players. Each element of the array is an object of the structure
     *  { username: (User object)
     *    status: (A string, which is either 'ready' or 'not ready') }
     */
    get_players_status() {
        return {
            players: this.players.map(player => {
                return {user: player.user, status: this.ready_state[player.user.username]};
            })
        };
    }
    /* Return an object encoding information for each room.
     * This is of the form
     * { room_code: (room code)
     *   players: (an array of User objects, denoting the players) }
     */
    get_room_data() {
        return {room_code: this.room_code,
            players: this.players.map(player => player.user)};
    }
    /* Sets the ready status of a User.
     * If, because of this, all players are ready, initialize the game.
     */
    set_player_status(user, ready_state) {
        this.ready_state[user.username] = ready_state;  
        if (this.players_all_ready) {
            this.initialize_game();
        }
    }
    /* Reset everyone's ready state.
     * The intention is to call this after a game.
     */
    reset_player_statuses() {
        for (const username in this.ready_state) {
            this.ready_state[username] = NOT_READY;
        }
    }
    /* Create a Game for the room, and prepare it.
     */
    initialize_game() {
        CodeSnippet.get_random({}).then((snippet) => {
            this.current_game = new Game(this.io, this.players, snippet[0], socketio_room_name(this.room_code));
            this.current_game.prepare_game(() => this.reset_player_statuses());
        });
    }
    /*
     * Adds listeners to process set-player-status, get-room-status and leave-room for
     * the given user socket.
     */
    register_room_commands(user_socket) {
        user_socket.on('set-player-status', (msg) => {
            this.set_player_status(user_socket.user, msg.current_status);
        });
        user_socket.on('get-room-status', (msg) => {
            user_socket.emit('get-room-status-return', this.get_players_status());
        });
        user_socket.on('leave-room', (msg) => {
            this.kick_user_from_room(user_socket);
        });
    }
    /* Removes any command listeners this socket has.
     *
     */
    deregister_room_commands(user_socket) {
        user_socket.removeAllListeners("set-player-status");
        user_socket.removeAllListeners("get-room-status");
        user_socket.removeAllListeners("leave-room");
    }
    /* Add a user to the room.
     * This method takes in the socket
     * that is connected to the current user.
     * This adds listeners for room commands, adds the user to the
     * socket.io room corresponding to this room, assigns
     * a guest user to the socket if it currently does not have a user,
     * and adds them to ready_state and players.
     *
     * Returns a User object corresponding to the current user.
     */
    add_user_to_room(user_socket) {
        user_socket.current_room = this;
        if (!user_socket.user) {
            const GUEST_USERNAME_ALPHABET = "ABCDEFGH0123456789";
            const GUEST_USERNAME_LENGTH = 8;
            const guest_username = random.random_string(GUEST_USERNAME_ALPHABET, GUEST_USERNAME_LENGTH);
            user_socket.user = new GuestUser(`Guest_${guest_username}`);
        }
        this.register_room_commands(user_socket);
        user_socket.join(socketio_room_name(this.room_code));
        this.ready_state[user_socket.user.username] = NOT_READY;
        this.players.push({user: user_socket.user, socket: user_socket});
        return user_socket.user;
    }
    /*
     * Kick the user from the room.
     * This removes them from the socketio room, deregisters their command listeners,
     * and clears their user information, if they are a guest user.
     */
    kick_user_from_room(user_socket) {
        user_socket.current_room = undefined;
        this.deregister_room_commands(user_socket);   
        user_socket.leave(socketio_room_name(this.room_code));
        delete this.ready_state[user_socket.user.username];
        this.players = this.players.filter(
            (player) => (player.user.username !== user_socket.user.username));
        if (!user_socket.user.id) {
            user_socket.user = undefined;
        }
        if (this.is_empty()) {
            this.manager.delete_room(this.room_code);
        }
    }
    get players_all_ready() {
        return Object.entries(this.ready_state)
            .map(([user, state]) => state === READY)
            .reduce((a, b) => (a && b), true);
    }
}

class RoomManager {
    /*
     * Class to manage all rooms currently hosted by the server.
     * Constructor takes a single options parameter, which is currently unused.
     *
     */
    constructor(options) {
        this.room_list = {};
        this.io = undefined;
    }
    set_server(io) {
        this.io = io;
    }
    /* Randomly generate a new room code.
     * **NOTE**: This does not check if the room code already exists,
     * but I did the math and a collision is only likely to happen
     * at around ~5000 rooms
     *
     * If the app needs to scale past this just increase ROOM_CODE_LENGTH i guess
     */
    generate_room_code() {
        const ROOM_CODE_LENGTH = 6;
        const ROOM_CODE_ALPHABET = "ABCDEFGH0123456789";
        return random.random_string(ROOM_CODE_ALPHABET, ROOM_CODE_LENGTH)
    }
    /* 
     * Given a room code and visibility status,
     * create a empty room with that code and visibility status.
     */
    create_room(room_code, visibility) {
        this.room_list[room_code] = new Room(
            {io: this.io, 
             room_code: room_code,
             manager: this, 
             visibility
            }); 
    }
    /* Deletes a room, given its room code.
     *
     */
    delete_room(room_code) {
        delete this.room_list[room_code];
    }
    /* 
     * Return a list of all rooms this RoomManager is currently keeping track of.
     */
    list_rooms() {
        return Object.values(this.room_list).map(room => room.get_room_data());
    }
    /** Return a list of all public rooms this RoomManager is currently keeping track of.
     * @returns {List<Room>}
     */
    list_public_rooms() {
        return this.list_rooms().filter(room => room.is_public);
    }
    /** Add a user to a room.
     * @param {Socket} user_socket
     *     A socket connected to the user to be added. Must contain the extra user property.
     * @param {string} room_code
     *     The room code of the room to join.
     * @returns {User|null} Return a User object corresponding to the current user, or `null`
     *     if there is no such room.
     */
    add_user_to_room(user_socket, room_code) {
        if (this.room_list.hasOwnProperty(room_code)) {
            this.room_list[room_code].add_user_to_room(user_socket);
            return user_socket.user;
        } else {
            user_socket.emit('error', {message: `Room ${room_code} does not exist`});
            return null;
        }
    }
    /*
     * Given a socket, 
     * register event listeners so the server can respond to create-room,
     * list-rooms and join-room requests issued over the socket.
     */
    register_manager_commands(socket) {
        socket.on('create-room', (msg) => {
            const new_room_code = this.generate_room_code();
            this.create_room(new_room_code, msg.visibility);
            socket.emit('create-room-return', {room_code: new_room_code});
        });
        socket.on('list-rooms', (msg) => {
            socket.emit('list-rooms-return', this.list_public_rooms()); 
        });
        socket.on('join-room', (msg) => {
            const joined_user = this.add_user_to_room(socket, msg.room_code);
            if (joined_user) {
                socket.emit('join-room-acknowledge', {user: joined_user, room_code: msg.room_code});
            }
        });
    }
};

module.exports.room_manager = new RoomManager();
module.exports.RoomManager = RoomManager;
module.exports.Room = Room;
