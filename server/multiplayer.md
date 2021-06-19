# On Multiplayer

All communication to the server regarding multiplayer will be handled using socket.io, due to the
need for two-way communication between the server and the client. I have yet to figure
out the exact details, but I'm planning to have roughly this flow:

Messages have a _type_, which will be the name of the event sockets will emit (and listen to).
Data will be sent in JSON, and how each message type's data is formatted will be explained here.
This type may be `error`, and if so, the message data will be an object
containing a string `message` with the reason, as well as any other diagnostic data needed.

[TODO decide: if/how to work acknowledgement messages into the protocol?]

- Client connects to websocket server. They can optionally send this:
### Type: login-ws
```
    data: {
        username: (username),
        password: (password)
    }
```
    This connects the client with the server.

    If they do not send this message, the server will treat them as an anonymous participant.
    when processing commands.

-

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
    The User object contains `id` and `username` properties. If a valid ws_login
    request was sent, this User will correspond to the logged-in user. If
    not, this User will be a guest user, whose id is null and whose username
    is randomly generated.

    Server will then send a `set-snippet` to the client.

### Type: list-rooms
```
    data: {
        (nothing atm, possibly filters?) 
    }
```
    Effect: Server will return a list-rooms-return, with the following data:
    ```
        data: {
            (an Object where each key is a room code, and each value is the Room
            that code stands for)
        }
    ```
### Type: leave-room
```
    data: {
        (nothing atm)
    }
```
    Effect: Server will remove the user from the room.

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
                status: (TODO decide ready or not ready)
                }
            ]
        }
        ```
### Type: set-player-status
```
    data: {
        current_status: (TODO decide ready or not ready)
    }
```
    Effect: The server will update the ready/not ready of the player. Upon
    (TODO decide criteria of game start), the game will start.
    The server will send a set-snippet, followed by a sequence
    of start-game-countdown messages.

-

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
            { username: (user),
              is_finished: (boolean indicating whether or not they are done),
              characters_typed: (ctyped)
            }
        ]
    }
```
    This message will be sent periodically every [TODO decide value of] X seconds to the client.
    This contains last known progress of each player in the race. The `characters_typed` value
    comes from any update_player_state messages they send, while `duration_since_start` 
    is tracked by the server.

        - The client must also send the following message periodically:
        ```
        type: update-player-state
        data: {
            characters_typed: (# of seconds) 
            current_accuracy: (current accuracy in race. TODO decide: or number of mistakes? idk)
        }
        ```
        This notifies the server of the current progress of the player.
        If characters_typed is equal to the length of the snippet, this will register
        a score in the database, and the client can stop sending update_player_state messages.


### Type: signal-game-end
```
    data: {
        scores: [ An array of Scores, with one for each player's performance ]
    }
```
    This message signals the end of a game. The client must stop sending update_player_state
    once it receives this, and must move into whatever end-of-game state it has. The client may
    send a set_player_status to ready themselves for the next game.


