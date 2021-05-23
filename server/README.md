## To start the backend:
- Build the client-side files using `yarn build` on the `client` directory
- Run `npm install` on the `server` directory, then run `npm run start`
- The website will now be available on localhost:3000.

This assumes you have the database running, and have a `.env` file in place of `.env.sample` with the
needed information. `sample_database_dump.sql` is a file SQL can read that initializes a test database.

---

# API Endpoints

All endpoints should be prefixed with `/api`, and return JSON data.

### `GET` `/code`

Fetch a code snippet. 

This returns an array with a single element. This is an object containing:
    - `id`: an integer, the ID of the code snippet,
    - `language`: a string, the language the code is written in
    - `code`: the code itself.

Supports the optional parameter `?lang=` to indicate a language for the snippet to fetch.

