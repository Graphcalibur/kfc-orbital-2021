/* Module for handling user data. */
const mysql = require('mysql2');
const argon2 = require('argon2');
const {con_pool} = require('../utils/database');

/* Errors */
// Error thrown when an attempt to register an already existing user is made.
class UsernameAlreadyExistsError extends Error {
    constructor(name) {
        super(name);
        this.message = name + " already exists";
    }
};

// Error thrown when a login is made for a non-existent user.
class NoUserExistsError extends Error {
    constructor(name) {
        super(name);
        this.message = "No user called " + name;
    }
};

// Error thrown when a login password is incorrect.
class IncorrectPasswordError extends Error {
    constructor(name) {
        super(name);
        this.message = "Incorrect password for " + name;
    }
};

let errors = {
    UsernameAlreadyExistsError: UsernameAlreadyExistsError,
    NoUserExistsError: NoUserExistsError,
    IncorrectPasswordError: IncorrectPasswordError
};

let User = class User {
    constructor(id, username) {
        this.id = id;
        this.username = username;
    }
    /* Used to register a user into the database.
     * If successful, return a User object representing the new user.
     * Throws UsernameAlreadyExistsError.
     */
    static async register(username, password) {
        const existing_usernames = await con_pool.query("SELECT COUNT(*) FROM user WHERE username = ?", username);
        const existing_usernames_count = existing_usernames[0]["COUNT(*)"];
        if (existing_usernames_count > 0) {
            throw new UsernameAlreadyExistsError(username);
        } else {
            const insert_user_result = await con_pool.query("INSERT INTO user SET username=?", username);
            const new_user_id = insert_user_result.insertId;
            const hashed_pw = await argon2.hash(password);
            const insert_pw_result = await con_pool.query("INSERT INTO user_password SET userid=?, password_hash=?", [new_user_id, hashed_pw]);
            return new User(new_user_id, username);
        }
    }
    /* Instantiate a User object from the given credentials.
     * If successful, return the User object corresponding to the authenticated user.
     * Throws NoUserExistsError, IncorrectPasswordError, and Error (in case of unknown database error).
     */
    static async from_authentication(username, password) {
        const user_id_results = await con_pool.query("SELECT id FROM user WHERE username = ?", username);
        if (user_id_results.length === 0) {
            throw new NoUserExistsError(username);
        } else {
            const userid = user_id_results[0].id;
            const saved_hash = await con_pool.query("SELECT password_hash FROM user_password WHERE userid = ?", userid)
            if (saved_hash.length !== 1) {
                throw new Error("Internal error occurred");
            } else if (await argon2.verify(saved_hash[0].password_hash, password)) {
                return new User(userid, username);
            } else {
                throw new IncorrectPasswordError(username);
            }
        }
    }
};

User.errors = errors;
module.exports = User;
