# On Multiplayer

All communication to the server regarding multiplayer will be handled using socket.io, due to the
need for two-way communication between the server and the client. I have yet to figure
out the exact details, but I'm planning to have roughly this flow:

Messages have a _type_, which will be the name of the event sockets will emit (and listen to).
Data will be sent in JSON, and how each message type's data is formatted will be explained here.
This type may be `error`, and if so, the message data will be an object
containing a string `message` with the reason, as well as any other diagnostic data needed.

[TODO decide: if/how to work acknowledgement messages into the protocol?]

---

Client can authenticate with the the websocket server using:
### Type: login-ws
```
    data: {
        username: (username),
        password: (password)
    }
```

This connects the client with the server. The server will return a `login-ws-return`. If
the login was successful, this message will contain a User object, corresponding to 
the user you just logged in as. If not, it will give an error message explaining
why it was unsuccessful.

If they do not send this message, the server will treat them as an anonymous participant
when processing commands.

### Type: logout-ws
```
    data: {
        (nothing)
    }
```
Logs out. This clears all user-specific data the server has with this connection, 
and if you were logged in, kicks you out of any rooms you are in.

### Type: check-current-login
```
    data: {
        (nothing)
    }
```
The server will return a `check-current-login-return`.
If there is a currently-logged in user, this message will contain a User object
corresponding to that user.
If the current user is connected as a guest user, this message will contain 
a dummy User object with null `id` and a randomly generated `username`. This
'guest' connection occurs when a non-logged in client sends a `join-room`.
If neither apply, returns null.

---

Client can send the following messages related to joining multiplayer rooms:
### Type: create-room
```
    data: {
        (nothing atm)
    }
```
Effect: Server will create a new room, sending back a create-room-return with the following data:
```
    data: {
        room_code: (room code)
    }
```
This is the code of the generated room.

### Type: join-room
```
    data: {
        room_code: (room code)
    }
```
Effect: Server will add them to the room. If private room, then we can probably add
a passcode to `data` or something. If the room code does not exist, return an error.
Server will then send a `join-room-acknowledge`, with the following data:
    ```
        data: { 
            user: (User object)
        }
    ```
The User object contains `id` and `username` properties. If a valid `login-ws`
request was sent beforehand, this User will correspond to the logged-in user. If
not, this User will be a guest user, whose id is null and whose username
is randomly generated.

### Type: list-rooms
```
    data: {
        (nothing atm, possibly filters?) 
    }
```
Effect: Server will return a `list-rooms-return`, with the following data:
```
    data: {
        (an Object where each key is a room code, and each value is the Room
        that code stands for. Each Room is of the following format:
            { room_code: (room code),
              players: (A list of Users, corresponding to the players in the room)}
        )
    }
```
### Type: leave-room
```
    data: {
        (nothing atm)
    }
```
Effect: Server will remove the user from the room. If no users are left in the room,
delete the room.

### Type: get-room-status
```
    data: {
        (nothing atm)
    }
```
Effect: The server will return a message that looks like this:
```
    type: get-room-status-return
    data: 
    {
        players: [ An array, with an element corresponding to each member in the room.
            { user: (User object)
            status: (A player's state. This is a string, which is either 'ready' or 'not ready'.)
            }
        ]
    }
```
### Type: set-player-status
```
    data: {
        current_status: (new player state)
    }
```
Effect: The server will update the ready/not ready of the player. Upon
(TODO decide criteria of game start), the game will start.
The server will send a set-snippet, followed by a sequence
of start-game-countdown messages.

---

Once in a room, the client can expect to receive the following messages:
### Type: set-snippet
```
    data: {
        snippet: (snippet object, same structure as `/api/code`)
    }
```
Effect: This is the snippet the room's next game will use.

### Type: start-game-countdown
```
    data: {
        seconds_to_start: (# of seconds to game start)
    }
```
Effect: A game is starting within the next (# of seconds) seconds; if the client intends
to show this in the UI, it can use this message.

If (# of seconds) = 0, then this message denotes the start of the game. The client 
must start sending update-player-state messages periodically once this happens.

### Type: update-race-state
```
    data: {
        duration_since_start: (number of milliseconds since start of game)
        [ An array with one element for each player in the race. Each element is of the form
            { user: (User),
              mistypes: (number of mistypes they made since start of race),
              line_no: (current line number),
              current_line: (a string, their current input field)
            }
        ]
    }
```
This message will be sent periodically every 1 second to the client.
This contains last known progress of each player in the race. The `characters_typed` value
comes from any `update-player-state` messages they send, while `duration_since_start` 
is tracked by the server.

### Type: signal-game-end
```
    data: {
        scores: [ An array of Scores, with one for each player's performance ]
    }
```
This message signals the end of a game. The client must stop sending `update-player-state`
once it receives this, and must move into whatever end-of-game state it has. The client may
send a `set-player-status` to ready themselves for the next game.

---

During a race, the client is expected to send the following message periodically:
### Type: update-player-state
```
    data: {
        mistypes: (number of mistypes they made since start of race),
        line_no: (current line number),
        current_line: (a string, their current input field)
    }
```
This notifies the server of the current progress of the player.
If `line_no` indicates the last line, and `current_line` exactly
matches the last line of the snippet, this will register
a score in the database, and the client can stop sending `update-player-state` messages.




