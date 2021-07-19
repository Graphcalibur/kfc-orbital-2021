const io = require("socket.io-client");
const { make_query_request } = require("../utils/sockets");
const test_port = process.env.TEST_SERVER_PORT || "6969";
const test_addr = process.env.TEST_SERVER_ADDRESS || "127.0.0.1";

test("can connect to server", (done) => {
  let socket = io.connect(`http://${test_addr}:${test_port}`);
  socket.on("connect", () => {
    socket.disconnect();
    done();
  });
});

describe("room-related messaging", () => {
  const READY = "Ready";
  const NOT_READY = "Not Ready";
  let socket, socket2;
  beforeAll((done) => {
    socket = io.connect(`http://${test_addr}:${test_port}`);
    socket2 = io.connect(`http://${test_addr}:${test_port}`);
    let good_connections = 0;
    const check_if_done = () => {
      good_connections += 1;
      if (good_connections === 2) done();
    };
    socket.on("connect", check_if_done);
    socket2.on("connect", check_if_done);
  });
  test("room list is initially empty", async () => {
    const room_list = await make_query_request(
      socket,
      "list-rooms",
      "list-rooms-return",
      {}
    );
    expect(room_list.length).toBe(0);
  });
  let generated_room_code;
  test("can create room", async () => {
    const create_room_result = await make_query_request(
      socket,
      "create-room",
      "create-room-return",
      {}
    );
    expect(typeof create_room_result.room_code).toBe("string");
    generated_room_code = create_room_result.room_code;
  });
  let current_user;
  test("can join created room as guest user", async () => {
    const join_room_result = await make_query_request(
      socket,
      "join-room",
      "join-room-acknowledge",
      { room_code: generated_room_code }
    );
    expect(join_room_result.user).toBeTruthy(); // check if it exists
    expect(join_room_result.user.id).toBeNull();
    expect(join_room_result.room_code).toEqual(generated_room_code);
    expect(typeof join_room_result.user.username).toBe("string");
    current_user = join_room_result.user;
    console.log(current_user);
  });
  let registered_user;
  const registered_user_credentials = {
    username: "abacaba123",
    password: "SpeedIAmSpeed",
  };
  test("can log in", async () => {
    const login_result = await make_query_request(
      socket2,
      "login-ws",
      "login-ws-return",
      registered_user_credentials
    );
    expect(login_result).toEqual({ id: 1, username: "abacaba123" });
    const current_login = await make_query_request(
      socket2,
      "check-current-login",
      "check-current-login-return",
      {}
    );
    expect(current_login).toEqual(login_result);
    registered_user = login_result;
  });
  test("can join room as registered user", async () => {
    const join_room_result = await make_query_request(
      socket2,
      "join-room",
      "join-room-acknowledge",
      { room_code: generated_room_code }
    );
    expect(join_room_result.user).toEqual(registered_user);
    expect(join_room_result.room_code).toEqual(generated_room_code);
  });
  test("can update room listing", async () => {
    const room_list = await make_query_request(
      socket,
      "list-rooms",
      "list-rooms-return",
      {}
    );

    expect(room_list.length).toBe(1);
    expect(room_list[0].room_code).toBe(generated_room_code);
    expect(room_list[0].players).toEqual([current_user, registered_user]);
  });
  test("can get initial status", async () => {
    const list_room_result = await make_query_request(
      socket,
      "get-room-status",
      "get-room-status-return",
      {}
    );
    expect(list_room_result).toEqual({
      players: [
        { user: current_user, status: NOT_READY },
        { user: registered_user, status: NOT_READY },
      ],
    });
  });
  test("can change status to ready", async () => {
    socket.emit("set-player-status", { current_status: READY });
    const list_room_result = await make_query_request(
      socket,
      "get-room-status",
      "get-room-status-return",
      {}
    );
    expect(list_room_result).toEqual({
      players: [
        { user: current_user, status: READY },
        { user: registered_user, status: NOT_READY },
      ],
    });
  });
  test("can leave room", async () => {
    socket.emit("leave-room", {});
    const room_list = await make_query_request(
      socket,
      "list-rooms",
      "list-rooms-return",
      {}
    );
    expect(room_list.length).toBe(1);
  });
  test("can delete room with zero players", async () => {
    socket2.emit("leave-room", {});
    const room_list = await make_query_request(
      socket,
      "list-rooms",
      "list-rooms-return",
      {}
    );
    expect(room_list.length).toBe(0);
  });
  afterAll((done) => {
    socket.disconnect();
    socket2.disconnect();
    done();
  });
});
