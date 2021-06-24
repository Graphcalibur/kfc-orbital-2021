const {setup_authentication_commands} = require('../socker/authenticator');
const {make_query_request} = require('../utils/sockets');
const test_username = "abacaba123";
const test_password = "SpeedIAmSpeed";

describe('Logging in and logging out', () => {
    let listeners = {};
    let socket = {on: jest.fn(), emit: jest.fn()};
    afterEach(() => {
        jest.clearAllMocks();
    })
    test('can register listeners', () => {
        setup_authentication_commands(socket);
        // check that the same set of commands is registered as this one
        let should_register = ['login-ws', 'logout-ws', 'check-current-login'];
        should_register.sort();
        let registered = socket.on.mock.calls.map((params) => params[0]);
        registered.sort();
        expect(registered).toEqual(should_register);
        socket.on.mock.calls.forEach((cps) => {listeners[cps[0]] = cps[1];});
    });
    test('can reject incorrect auth', async () => {
        const wrong_password = "IAmNotSpeed";
        expect(listeners["login-ws"]).toBeTruthy();
        await listeners["login-ws"]({username: test_username, password: wrong_password});
        // test that an error is emitted
        expect(socket.emit.mock.calls).toEqual([['error', {message: "Incorrect password for abacaba123"}]]);
    });
    test('can give empty current user', async () => {
        expect(listeners["check-current-login"]).toBeTruthy();
        await listeners["check-current-login"]({});
        expect(socket.emit.mock.calls).toEqual([[
            'check-current-login-return', 
            null
        ]])
    });
    test('can accept correct auth', async () => {
        expect(listeners["login-ws"]).toBeTruthy();
        await listeners["login-ws"]({username: test_username, password: test_password});
        // test that the socket's user is assigned
        expect(socket.user).toEqual({id: 1, username: "abacaba123"});
        expect(socket.emit.mock.calls).toEqual([[
            'login-ws-return',
            {id: 1, username: "abacaba123"}
        ]])
    });
    test('can give current login', () => {
        expect(listeners["check-current-login"]).toBeTruthy();
        listeners["check-current-login"]({});
        expect(socket.emit.mock.calls).toEqual([[
            'check-current-login-return', 
            {id: 1, username: "abacaba123"}
        ]]);
    });
    test('can log out', () => {
        const mock_room = {kick_user_from_room: jest.fn((s) => {s.current_room = undefined})};
        socket.current_room = mock_room;
        expect(listeners["logout-ws"]).toBeTruthy();
        listeners["logout-ws"]();
        expect(socket.current_room).toBeUndefined();
        expect(mock_room.kick_user_from_room.mock.calls).toEqual([[
            socket
        ]]);
    });
});