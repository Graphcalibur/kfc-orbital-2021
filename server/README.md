## To start the backend:
- Build the client-side files using `yarn build` on the `client` directory
- Run `npm install` on the `server` directory, then run `npm run start`
- The website will now be available on localhost:9000.

This assumes you have the database running, and have a `.env` file in place of `.env.sample` with the
needed information. `sample_database_dump.sql` is a file SQL can read that initializes a test database.

---

# API Endpoints

All endpoints should be prefixed with `/api`, and return JSON data.

The server might set the `connect.sid` cookie sometimes. If you are not a browser, keep track of this,
as this is how the server identifies you, and therefore lets you access protected endpoints.

The sample SQL database lets you test user authentication with user `abacaba123` and pass `SpeedIAmSpeed`.

### `GET` `/code`

Fetch a code snippet. 

This returns an array with a single element, representing a code snippet object. This is an object containing:
    - `id`: an integer, the ID of the code snippet,
    - `language`: a URL-encoded string, the language the code is written in
    - `code`: the code itself.

Supports the optional parameter `?lang=` to indicate a language for the snippet to fetch.

### `POST` `/stats/upload/[snippetid]/[speed]wpm/[accuracy]`

Upload a performance on the snippet with ID `snippetid`, with `speed` WPM and an accuracy of `accuracy`.
If the request is made with a valid login, associate this performance with the currently logged-in User.
Return the resulting Score object. This is an object containing:

    - `snippetid`: an integer, the ID of the code snippet,
    - `playid`: an integer, the ID of the performance,
    - `acc`: a decimal, the accuracy of the performance,
    - `speed`: an integer, the WPM of the performance,
    - `userid`, the user ID of the associated user. If one does not exist, output `null`.

### `POST` `/register`

Register a new user to the website. Accepts `username` and `password` parameters via form-encoded input.

If there already exists a user in the database, the return code will be `409`. Otherwise, return
a User object corresponding to the newly registered user. This is an object containing:
    - `username`: the username of the user.

### `POST` `/authuser`

Login. Accepts `username` and `password` parameters via form-encoded input.

If the authentication succeeds, return a User object.
Otherwise, the return code is `401`, and the return value is an object of the
form `{message: [error message]}`

### `GET` `/user/[username]/testauth`

This is a protected endpoint.

If you are not logged in as `[username]`, the return code is `401`,  and the return value is an object of the
form `{message: [error message]}`. If you are, return a single string containing `Auth OK`.

### `GET` `/current-login`

If there is a valid login, return the User that login corresponds to. If not, return `null`.

### `POST` `/logout`

Destroy the current session, if there exists one.

---

# Database Layout

```
CREATE TABLE `code_snippet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `language` varchar(20) NOT NULL,
  `code` varchar(2000) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
)

CREATE TABLE `user_password` (
  `userid` int NOT NULL,
  `password_hash` varchar(200) NOT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `userid_UNIQUE` (`userid`),
  CONSTRAINT `fk_userid` FOREIGN KEY (`userid`) REFERENCES `code_snippet` (`id`) ON DELETE CASCADE
)
```
