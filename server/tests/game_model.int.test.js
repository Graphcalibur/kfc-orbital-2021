const { Game } = require('../models/Game');
const { CodeSnippet } = require('../models/CodeSnippet');
const { Score, User } = require('../models/User');
const {toBeDeepCloseTo,toMatchCloseTo} = require('jest-matcher-deep-close-to');
expect.extend({toBeDeepCloseTo, toMatchCloseTo});

jest.useFakeTimers();
const get_mock_socket = () => {
    return {on: jest.fn(), emit: jest.fn()};
};

const mock_io = {
    to: jest.fn((room_code) => {
        return mock_io;
    }),
    emit: jest.fn((evt, data) => null),
};

const player_list = [
    {user: new User(5, "testuser237"),
     socket: get_mock_socket()},
    {user: new User(6, "gaganabayungtest"),
     socket: get_mock_socket()}
];

const snippet = new CodeSnippet(10, "Brainfuck",
        "++++++++[>++++[>++>+++>+++>+<<<<-]\n" + 
        "   >+>+>->>+[<]<-]\n" +
        ">>.>---.+++++++..+++.>>\n" + 
        ".<-.<.+++.------.--------.>>+.>++."
);

const socketio_room = "abcabc5";

beforeAll(() => {
    // mock Score.register, so we don't hit the database
    jest.spyOn(Score, 'register').mockImplementation(async (snippetid, speed, acc, isMultiplayer, userid = null) => {
        return new Score(userid, snippetid, speed, acc, 
            Date.now() / 1000, isMultiplayer ? "Multiplayer" : "Solo", userid);
    });
});

afterAll(() => {
    jest.restoreAllMocks();
})

beforeEach(() => {
    jest.clearAllMocks();
});

describe('manual updating through update_player_state', () => {
    /* this set will test
     * is_finished, player_states, update_player_states,
     * (and via update_player_states, finish_game and mark_player_as_finished)
     */
    let game;
    beforeAll(() => {
        game = new Game(mock_io, player_list, snippet, socketio_room);
    });
    test("can correctly give initial game state", () => {
        expect(game.is_finished).toBe(false);
        expect(game.player_states).toEqual([
            {user: {id: 5, username: "testuser237"},
             mistypes: 0,
             line_no: 0,
             current_line: ""},
            {user: {id: 6, username: "gaganabayungtest"},
             mistypes: 0, 
             line_no: 0,
             current_line: ""}
        ]);
    });
    test('can update state of player 1', () => {
        game.update_player_state(player_list[0].user,{mistypes: 3, line_no: 3, current_line: ".<-.a"});
        expect(game.is_finished).toBe(false);
        expect(game.player_states).toEqual([
            {user: {id: 5, username: "testuser237"},
             mistypes: 3,
             line_no: 3,
             current_line: ".<-.a"},
            {user: {id: 6, username: "gaganabayungtest"},
             mistypes: 0, 
             line_no: 0,
             current_line: ""}
        ]);
    });
    test('can finish game for player 1', () => {
        jest.advanceTimersByTime(7000);
        game.update_player_state(player_list[0].user, {mistypes: 5, line_no: 3, current_line: ".<-.<.+++.------.--------.>>+.>++." });
        expect(game.is_finished).toBe(false);
        expect(game.player_states).toEqual([
            {user: {id: 5, username: "testuser237"},
             mistypes: 5,
             current_line: ".<-.<.+++.------.--------.>>+.>++.",
             line_no: 3},
            {user: {id: 6, username: "gaganabayungtest"},
             mistypes: 0, 
             line_no: 0,
             current_line: ""}
        ]);
    });
    test('can finish game', (done) => {
        jest.advanceTimersByTime(4000);
        game.game_finish_cb = () => {
            // check if the proper Scores were registered
            expect(Score.register.mock.calls).toBeDeepCloseTo([
                [10, 186.857, 95.614, true, 5],
                [10, 118.909, 93.965, true, 6]
            ], 3);
            done();
        };
        game.update_player_state(player_list[1].user, {mistypes: 7, line_no: 3, current_line: ".<-.<.+++.------.--------.>>+.>++."});
    });
});

describe.only('socket communication', () => {
    let game;
    let player1_update_listener, player2_update_listener;
    beforeAll(() => {
        game = new Game(mock_io, player_list, snippet, socketio_room);
    })
    test('can run countdown and register listeners', () => {
        game.prepare_game();
        // 12 events (11 countdown 1 set-snippet) to check; each one with 2 checks (.to and .emit)
        // plus two .toBeCalledWith checks for update-player-status listener
        expect.assertions(26);
        // check if a set-snippet was broadcasted to the room
        expect(mock_io.to.mock.calls[0]).toEqual([socketio_room]);
        expect(mock_io.emit.mock.calls[0]).toEqual([
            'set-snippet',
            {snippet: {id: snippet.id,
            language: snippet.language,
            code: snippet.code}}
        ]);
        // check for the broadcasts of countdown-game-start
        expect(mock_io.to.mock.calls[1]).toEqual([socketio_room]);
        expect(mock_io.emit.mock.calls[1]).toEqual([
            'start-game-countdown',
            {seconds_to_start: 10}
        ]);
        for (let seconds_left = 9, call_idx = 2; seconds_left >= 0; --seconds_left, ++call_idx) {
            jest.advanceTimersByTime(1000);
            expect(mock_io.to.mock.calls[call_idx]).toEqual([socketio_room]);
            expect(mock_io.emit.mock.calls[call_idx]).toEqual([
                'start-game-countdown',
                {seconds_to_start: seconds_left}
            ]);
        }
        expect(player_list[0].socket.on).toBeCalledWith('update-player-state', expect.any(Function));
        player1_update_listener = player_list[0].socket.on.mock.calls[0][1];
        expect(player_list[1].socket.on).toBeCalledWith('update-player-state', expect.any(Function));
        player2_update_listener = player_list[1].socket.on.mock.calls[0][1];
    });
    test('can broadcast regular updates', () => {
        // step timer by 1s so we get updates
        jest.advanceTimersByTime(1000);  // time since start: 1s
        const current_states = [
            {user: {id: 5, username: "testuser237"},
             mistypes: 0,
             line_no: 0,
             current_line: ""},
            {user: {id: 6, username: "gaganabayungtest"},
             mistypes: 0, 
             line_no: 0,
             current_line: ""}
        ];
        const current_update = {
            duration_since_start: 1000,
            player_states: current_states
        };
        expect(mock_io.to).toBeCalledWith(socketio_room);
        expect(mock_io.emit).toBeCalledWith('update-race-state', current_update);
    });
    test('can update player state', () => {
        jest.advanceTimersByTime(667); // time since start: 1.667 s
        player1_update_listener({mistypes:0, line_no:3, current_line: ".<-.<.+++.------.--------.>>+.>++."});
        const current_states = [
            {user: {id: 5, username: "testuser237"},
             mistypes: 0,
             line_no: 3,
             current_line: ".<-.<.+++.------.--------.>>+.>++."},
            {user: {id: 6, username: "gaganabayungtest"},
             mistypes: 0, 
             line_no: 0,
             current_line: ""}
        ];
        const current_update = {
            duration_since_start: 2000,
            player_states: current_states
        };
        jest.advanceTimersByTime(333); // time since start: 2s
        expect(mock_io.to).toBeCalledWith(socketio_room);
        expect(mock_io.emit).toBeCalledWith('update-race-state', current_update);
    });
    test('can partially update player state', () => {
        jest.advanceTimersByTime(3500); // time since start: 5.5 s
        player2_update_listener({mistypes:3, line_no:3, current_line: ".<-.<.+++.------.--------.>>+."});
        const current_states = [
            {user: {id: 5, username: "testuser237"},
             mistypes: 0,
             line_no: 3,
             current_line: ".<-.<.+++.------.--------.>>+.>++."},
            {user: {id: 6, username: "gaganabayungtest"},
             mistypes: 3,
             line_no: 3,
             current_line: ".<-.<.+++.------.--------.>>+."},
        ];
        const current_update = {
            duration_since_start: 6000,
            player_states: current_states
        };
        jest.advanceTimersByTime(500); // time since start: 6s
        expect(mock_io.to).lastCalledWith(socketio_room);
        expect(mock_io.emit).lastCalledWith('update-race-state', current_update);
    })
    test('can finish game', (done) => {
        game.game_finish_cb = () => {
            expect(Score.register.mock.calls[0]).toBeDeepCloseTo(
                [10, 784.643, 100, true, 5], 3);
            expect(Score.register.mock.calls[1]).toBeDeepCloseTo(
                [10, 201.230, 97.321, true, 6], 3);
            done();
        };

        // give update that finishes game
        jest.advanceTimersByTime(500); // time since start: 6.5s
        console.log("game done", new Date(), game.game_start_time);
        player2_update_listener({mistypes:3, line_no:3, current_line: ".<-.<.+++.------.--------.>>+.>++."});
    })
});