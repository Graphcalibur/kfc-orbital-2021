const {TypingStatus} = require('./TypingStatus');
const {Score} = require('./User');
/*  Class to model the state of a race.
 *  Note that this handles all data specific to a single race,
 *  while Room handles players entering and leaving.
 */

const RACE_UPDATE_DURATION = 1000; // in milliseconds
const RACE_COUNTDOWN_SECONDS = 10;

let Game = class Game {
    /*  The constructor takes the following arguments:
     *  - io: The socket.io module, to use for sending messages
     *  - players: A list of objects, each representing a player.
     *       Each object should be of the form {user: [User], socket: [socketio socket]}.
     *  - snippet: The code snippet to use in launching the game.
     *  - socket_room_code: The name of a socket.io room where all the players
     *       are in. This is used to broadcast messages to the whole room.
     */
    constructor(io, players, snippet, socket_room_code) {
        this.io = io;
        this.players = players;
        this.snippet = snippet;
        this.socketio_room = socket_room_code;
        this.current_status = new Map(); // Keys are Users, values are TypingStatuses
        this.game_start_time = null;
        this.broadcast_update_handle = null;
        this.game_finish_cb = null;
    }
    /* Check if all players in the game have finished typing.
     */
    get is_finished() {
        return [...this.current_status.entries()]
            .map(([k, v]) => v.is_finished)
            .reduce((a, b) => a && b, true);
    }
    /* Given a user, and a status with mistypes, line_no, and current_line properties
     * (the same structure as the payload of update-player-state), update their
     * state to reflect this status. If this indicates a finished state,
     * mark them as finished.
     */
    update_player_state(user, new_status) {
        const user_status = this.current_status.get(user);
        user_status.update_with(new_status);
        if (user_status.is_finished) {
            this.mark_player_as_finished(user);
        }
    }
    /* Register a listener for update-player-state.
     */
    register_update_listener(user, socket) {
        socket.on('update-player-state', (msg) => {
            this.update_player_state(user, msg);
        });
    }
    /* Mark the player as finished, logging the time they finished.
     * If all players are finished, finish the game.
     */
    mark_player_as_finished(user) {
        this.current_status.get(user).mark_as_finished();
        if (this.is_finished) {
            this.finish_game();
        }
    }
    /* Returns an array corresponding to player_states in the update-race-state payload.
     */
    get player_states() {
        return [...this.current_status.entries()]
            .map(([user, status]) => {
                let state = status.client_repr;
                state.user = {id: user.id, username: user.username};
                return state;
            });
    }
    /* Run the game, by periodically sending update-race-state messages
     * and listening for update-player-state messages.
     * Takes a callback argument, which is called when the game ends.
     */
    run_game(cb) {
        this.game_start_time = new Date();
        this.game_finish_cb = cb || (() => null);
        for (const player of this.players) {
            this.register_update_listener(player.user, player.socket);
            this.current_status.set(player.user, new TypingStatus(this.snippet, this.game_start_time));
        }
        const broadcast_updates = () => {
            const current_time = new Date();
            this.io.to(this.socketio_room).emit(
                'update-race-state',
                {duration_since_start: current_time.getTime() - this.game_start_time.getTime(),
                 player_states: this.player_states}
            );
        };
        this.broadcast_update_handle = setInterval(broadcast_updates, RACE_UPDATE_DURATION);
    }
    /* Sends set-snippet and start-game-countdown messages, 
     * and starts the game, as in the multiplayer protocol.
     * Takes a callback argument, which is called when the game ends.
     */
    prepare_game(cb) {
        this.io.to(this.socketio_room).emit('set-snippet',
            {snippet: {id: this.snippet.id,
                       language: this.snippet.language,
                       code: this.snippet.code}}
        );
        const send_countdown = (count) => {
            this.io.to(this.socketio_room).emit(
                'start-game-countdown',
                {seconds_to_start: count}
            );
            if (count == 0) {
                this.run_game(cb);
            } else {
                setTimeout(() => send_countdown(count - 1, cb),
                    1000);
            }
        };
        send_countdown(RACE_COUNTDOWN_SECONDS, send_countdown);
    }
    // Clean up by saving the scores of all registered users.
    finish_game() {
        clearInterval(this.broadcast_update_handle);
        const get_scores = async () => {
            let final_scores = new Map();
            for (const [user, status] of this.current_status.entries()) {
                const {speed, acc, time} = status.play_statistics;
                let score;
                if (user.id) { // they are registered, use Score.register
                    score = await Score.register(this.snippet.id, speed, acc, true, user.id);
                } else {
                    score = new Score(null, this.snippet.id, speed, acc, time, 'Multiplayer', null);
                }
                final_scores.set(user, score);
            }
            return final_scores;
        };
        get_scores().then((scores) => {
            this.io.to(this.socketio_room).emit(
                'signal-game-end',
                {scores: scores.entries()
                        .map(([user, score]) => {user, score})
                }
            );
            this.game_finish_cb();
        }).catch((err) => {
            this.io.to(this.socketio_room).emit(
                'signal-game-end',
                {}
            );
            this.io.to(this.socketio_room).emit(
                'error',
                {message: "Internal server error occurred during saving scores",
                 data: err}
            );
            this.game_finish_cb();
        });
    }
};

module.exports.Game = Game;