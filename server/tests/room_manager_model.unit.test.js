const {RoomManager} = require('../models/RoomManager');
const {User} = require('../models/User');
let room_manager = new RoomManager();

test('can generate room codes', () => {
    const code = room_manager.generate_room_code();
    expect(code.length).toBe(6);
});

let generated_code_1 = room_manager.generate_room_code();
let generated_code_2 = room_manager.generate_room_code();
test('can make and list rooms', () => {
    room_manager.create_room(generated_code_1);
    room_manager.create_room(generated_code_2);
    let expected_room_list = []; 
    expected_room_list.push({
        room_code: generated_code_1,
        players: []
    });
    expected_room_list.push({
        room_code: generated_code_2,
        players: []
    });
    const actual_room_set = new Set(room_manager.list_rooms());
    const expected_room_set = new Set(expected_room_list);
    expect(actual_room_set).toEqual(expected_room_set);
});

test('can add registered user to room', () => {
    const u = new User(1, "abacaba123");
    const mock_socket = {join: jest.fn(),
        on: jest.fn(),
        user: u};
    room_manager.add_user_to_room(mock_socket, generated_code_1);
    const room_list = room_manager.list_rooms();
    expect.assertions(3);
    room_list.forEach((room) => {
        if (room.room_code === generated_code_1) {
            expect(room.players.length).toBe(1);
            expect(room.players[0]).toEqual(u);
        } else {
            expect(room.players.length).toBe(0);
        }
    });
});

test('can add guest user to room', () => {
    const mock_socket = {join: jest.fn(),
        on: jest.fn()
    };
    room_manager.add_user_to_room(mock_socket, generated_code_2);
    const room_list = room_manager.list_rooms();
    expect.assertions(5);
    expect(mock_socket.user).toBeTruthy();
    expect(mock_socket.user.id).toBeNull();
    expect(mock_socket.user.username).toBeTruthy();
    room_list.forEach((room) => {
        if (room.room_code === generated_code_2) {
            expect(room.players.length).toBe(1);
            expect(room.players[0]).toEqual(mock_socket.user);
        }
    })
});

test('can register room commands', () => {
    const mock_socket = {on: jest.fn()};
    room_manager.register_manager_commands(mock_socket);
    expect(mock_socket.on.mock.calls.length).toBe(3);
    let expected_commands_registered = ["create-room", "list-rooms", "join-room"];
    expected_commands_registered.sort();
    let commands_registered = mock_socket.on.mock.calls.map((params) => params[0]);
    commands_registered.sort();
    expect(commands_registered).toEqual(expected_commands_registered); 
})
