const { Room } = require("../models/RoomManager");
const { User } = require("../models/User");

const room_code = "test12";
const room = new Room({ room_code: room_code });

test("can add command listeners to user socket", () => {
  let mock_socket = { on: jest.fn() };
  room.register_room_commands(mock_socket);
  expect(mock_socket.on.mock.calls.length).toBe(3);
  let should_listen = ["set-player-status", "get-room-status", "leave-room"];
  let registered = mock_socket.on.mock.calls.map((call) => call[0]);
  should_listen.sort();
  registered.sort();
  expect(registered).toEqual(should_listen);
});

test("can remove command listeners from user socket", () => {
  let mock_socket = { removeAllListeners: jest.fn() };
  room.deregister_room_commands(mock_socket);
  expect(mock_socket.removeAllListeners.mock.calls.length).toBe(3);
  let should_listen = ["set-player-status", "get-room-status", "leave-room"];
  let registered = mock_socket.removeAllListeners.mock.calls.map(
    (call) => call[0]
  );
  should_listen.sort();
  registered.sort();
  expect(registered).toEqual(should_listen);
});

test("can report empty room", () => {
  expect(room.is_empty()).toBeTruthy();
});

// test registered user
const registered_user = new User(1, "abacaba123");
test("can add registered user to room", () => {
  const u = registered_user;
  const mock_usocket = { user: u, join: jest.fn(), on: jest.fn() };
  const added_user = room.add_user_to_room(mock_usocket);
  expect(mock_usocket.join.mock.calls.length).toBe(1);
  expect(mock_usocket.join.mock.calls[0][0]).toEqual(`game_room:${room_code}`);
  expect(added_user).toEqual(u);
});

// test guest user
let guest_user;
test("can add guest user to room", () => {
  const mock_usocket = { join: jest.fn(), on: jest.fn() };
  const added_user = room.add_user_to_room(mock_usocket);
  expect(mock_usocket.join.mock.calls.length).toBe(1);
  expect(mock_usocket.join.mock.calls[0][0]).toEqual(`game_room:${room_code}`);
  expect(added_user.id).toBe(null);
  expect(added_user.username.length).toBe(14); // Guest_ + 8 random chars
  guest_user = added_user; // set it up for the next tests
});

test("can list room occupants", () => {
  const room_data = room.get_room_data();
  expect(room_data.room_code).toEqual(room_code);
  const expected_player_list = [registered_user, guest_user];
  expect(room_data.players).toEqual(expected_player_list);
});

test("can report non-empty room", () => {
  expect(room.is_empty()).toBeFalsy();
});

const READY = "Ready";
const NOT_READY = "Not Ready";
test("can set all users initially to non ready", () => {
  const status = room.get_players_status();
  const player_list = status.players;
  expect.assertions(3 * player_list.length);
  player_list.forEach((player) => expect(player.user.id).not.toBeUndefined());
  player_list.forEach((player) => expect(player.user.username).toBeTruthy());
  player_list.forEach((player) => expect(player.status).toEqual(NOT_READY));
});

test("can change ready state", () => {
  room.set_player_status(registered_user, READY);
  const status = room.get_players_status();
  const player_list = status.players;
  expect.assertions(player_list.length + 1);
  player_list.forEach((player) =>
    expect(player.status).toEqual(
      player.user.id == registered_user.id ? READY : NOT_READY
    )
  );
  expect(room.players_all_ready).toBeFalsy();
});

test("can kick user from room", () => {
  // mock the user socket
  const mock_usocket = {
    leave: jest.fn(),
    current_room: room,
    removeAllListeners: jest.fn(),
  };
  mock_usocket.user = registered_user;

  room.kick_user_from_room(mock_usocket);

  // test that they have left the socket.io room, that they have no current room,
  // and that the room's listing does not have them
  const player_list = room.get_players_status().players;
  expect.assertions(player_list.length + 2);
  expect(mock_usocket.leave.mock.calls).toEqual([[`game_room:${room_code}`]]);
  expect(mock_usocket.current_room).toBeUndefined();
  player_list.forEach((player) =>
    expect(player.user.username).not.toEqual(registered_user.username)
  );
});
