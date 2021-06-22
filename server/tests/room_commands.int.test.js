const io = require('socket.io-client');
const {make_query_request} = require('../utils/sockets');
const test_port = process.env.TEST_SERVER_PORT || "6969";
const test_addr = process.env.TEST_SERVER_ADDRESS || "127.0.0.1";

test('can connect to server', (done) => {
    let socket = io.connect(`http://${test_addr}:${test_port}`);
    socket.on('connect', () => {
        socket.disconnect();
        done();
    });
});

describe('room-related messaging',  () => {
    const READY = 'ready';
    const NOT_READY = 'not ready';
    let socket;
    beforeAll((done) => {
        socket = io.connect(`http://${test_addr}:${test_port}`);
        socket.on('connect', () => {
            done();
        });
    });
    test('room list is initially empty', async () => {
        const room_list = await make_query_request(socket, 'list-rooms', 'list-rooms-return', {});
        expect(room_list.length).toBe(0);
    });
    let generated_room_code;
    test('can create room', async () => {
        const create_room_result = await make_query_request(socket, 'create-room', 'create-room-return', {});
        expect(typeof create_room_result.room_code).toBe("string");
        generated_room_code = create_room_result.room_code;
    });
    let current_user;
    test('can join created room as guest user', async () => {
        const join_room_result = await make_query_request(socket, 'join-room', 'join-room-acknowledge',
            {room_code: generated_room_code});
        expect(join_room_result.user).toBeTruthy(); // check if it exists
        expect(join_room_result.user.id).toBeNull();
        expect(typeof join_room_result.user.username).toBe("string");
        current_user = join_room_result.user;
        console.log(current_user);
    });
    test('can update room listing', async () => {
        const room_list = await make_query_request(socket, 'list-rooms', 'list-rooms-return', {});
        expect(room_list.length).toBe(1);
        expect(room_list[0].room_code).toBe(generated_room_code);
        expect(room_list[0].players).toEqual([current_user]);
    });
    test('can get initial status', async () => {
        const list_room_result = await make_query_request(socket, 'get-room-status', 'get-room-status-return',
            {});
        expect(list_room_result).toEqual({
            players: [
                {user: current_user,
                 status: NOT_READY}
            ]
        });
    });
    test('can change status to ready', async () => {
        socket.emit('set-player-status', {current_status: READY});
        const list_room_result = await make_query_request(socket, 'get-room-status', 'get-room-status-return',
            {});
        expect(list_room_result).toEqual({
            players: [
                {user: current_user,
                status: READY}
            ]
        });
    });
    test('can leave room', async () => {
        socket.emit('leave-room', {});
        const room_list = await make_query_request(socket, 'list-rooms', 'list-rooms-return', {});
        expect(room_list.length).toBe(0); // room should be deleted
    });
    afterAll((done) => {
        socket.disconnect();
        done();
    })
});
