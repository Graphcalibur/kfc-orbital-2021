
/* Utility function for making request-and-response messages.
 * Returns a Promise that resolves to a server response.
 * Parameters:
 *  - socket: A socket to make the query with.
 *  - message_type: The message type to send.
 *  - message_return_type: The type the server will use to send the return message.
 *  - data: The data to send.
 *  - timeout (default 5000ms): If no response is received by this duration, reject.
 */
const make_query_request = (socket, message_type, message_return_type, data, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        const timeoutID = setTimeout(() => {
            reject(new Error(`Query for ${message_type} timed out after ${timeout} ms`))
        }, timeout);
        socket.once(message_return_type, (msg) => {
            clearTimeout(timeoutID);
            resolve(msg);
        });
        socket.once('error', (msg) => {
            reject(msg);
        });
        socket.emit(message_type, data);
    });
};

const ioc = require("socket.io-client");
jest.setTimeout(25000);
jest.useRealTimers();

test('can run game', (done) => {
    let socket = ioc.connect("http://localhost:6969");
    socket.on('connect', async () => {
        let socket2 = ioc.connect("http://localhost:6969");
        socket2.on('connect', async () => {
            /* Uncomment to log messages the sockets get */
            // socket.onAny((evt, args) => console.log("1 Got", evt, args));
            // socket2.onAny((evt, args) => console.log("2 Got", evt, args));
            const {room_code} = await make_query_request(socket, 'create-room', 'create-room-return', {visibility: 'private'});
            const jra = await make_query_request(socket, 'join-room', 'join-room-acknowledge', {room_code});
            const jra2 = await make_query_request(socket2, 'join-room', 'join-room-acknowledge', {room_code});
            let finished_state;
            socket.on('set-snippet', (msg) => {
                const final_line_no = msg.snippet.code.split("\n").length;
                const final_line = "";
                finished_state = {
                    mistypes: 0,
                    line_no: final_line_no,
                    current_line: final_line
                };
            });
            const play_game = async (repeats) => {
                if (repeats >= 1) done();
                socket.emit('set-player-status', {current_status: 'Ready'});
                socket2.emit('set-player-status', {current_status: 'Ready'});
                socket.emit('get-room-status', {});
                setTimeout( () => {
                    socket.emit('update-player-state', finished_state);
                }, 13000);
                setTimeout( () => {
                    socket2.emit('update-player-state', finished_state);
                }, 15000);
                const finish = await make_query_request(socket, 'signal-game-end', 'signal-game-end', {}, 20000);
                socket.disconnect();
                socket2.disconnect();
                done();
            };
            await play_game(0);
        });
    }) 
});
