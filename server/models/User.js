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

errors.is_user_error = function(err) {
    return Object.keys(errors)
        .some((err_type) => err instanceof errors[err_type]);
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
    /* Instantiate a User object.
     * If successful, return the User.
     * Throws NoUserExistsError.
     */
    static async from_username(username) {
        const user_id_results = await con_pool.query("SELECT id FROM user WHERE username = ?", username);
        if (user_id_results.length === 0) {
            throw new NoUserExistsError(username);
        } else {
            const userid = user_id_results[0].id;
            return new User(userid, username);
        }
    }
    /* Instantiate a User object from the given credentials.
     * If successful, return the User object corresponding to the authenticated user.
     * Throws NoUserExistsError, IncorrectPasswordError, and Error (in case of unknown database error).
     */
    static async from_authentication(username, password) {
        const user = await User.from_username(username);
        const saved_hash = await con_pool.query("SELECT password_hash FROM user_password WHERE userid = ?", user.id);
        if (saved_hash.length !== 1) {
            throw new Error("Internal error occurred");
        } else if (await argon2.verify(saved_hash[0].password_hash, password)) {
            return user;
        } else {
            throw new IncorrectPasswordError(username);
        }
    }
    build_scorelist_query_conditions(filters) {
        let query = ['userid = ?'];
        let params = [this.id];
        if (filters.lang) {
            query.push('language = ?');
            params.push(filters.lang);
        }
        if (filters.context) {
            query.push('context = ?');
            params.push(filters.context);
        }
        return {conditions: query.join(' AND '), params: params};
    };
    async get_summary_data(filters) {
        const {recent_count} = filters;
        const limit_query = recent_count ? " LIMIT 0, ?" : "";
        const limit_params = recent_count ? [recent_count] : [];
        const {conditions, params} = this.build_scorelist_query_conditions(filters);
        const speed_query = await con_pool.query("SELECT AVG(speed), MAX(speed), AVG(accuracy), MAX(accuracy), COUNT(*) " +
            "FROM (SELECT * FROM score WHERE "+ conditions  + limit_query + ") as filteredScore",
            params.concat(limit_params));
        return {speed: {average: Number(speed_query[0]["AVG(speed)"]),
                        maximum: Number(speed_query[0]["MAX(speed)"])},
                accuracy: {average: Number(speed_query[0]["AVG(accuracy)"]),
                           maximum: Number(speed_query[0]["MAX(accuracy)"])},
                playcount: Number(speed_query[0]["COUNT(*)"])};
    }
    async get_scorecount(filters) {
        const {conditions, params} = this.build_scorelist_query_conditions(filters);
        const query_results = await con_pool.query("SELECT COUNT(*) AS count FROM score " +
            " INNER JOIN code_snippet ON score.snippetid = code_snippet.id " +
            " WHERE " + conditions,
            params);
        return query_results[0].count;
    }
    async get_scorelist(filters, from, count) {
        const {conditions, params} = this.build_scorelist_query_conditions(filters);
        const query_results = await con_pool.query("SELECT * FROM score " +
            " INNER JOIN code_snippet ON score.snippetid = code_snippet.id " +
            " WHERE " + conditions
            + " ORDER BY time DESC LIMIT ?, ?",
            params.concat([from, count]));
        return query_results.map(res => new Score(res.playid, res.id, res.speed, Number(res.accuracy), Date.parse(res.time), res.userid));
    }
};

let Score = class Score {
    constructor(playid, snippetid, speed, acc, time, context, userid = null) {
        this.playid = playid;
        this.speed = speed;
        this.acc = acc;
        this.snippetid = snippetid;
        this.time = time;
        this.userid = userid;
        this.context = context;
    }
    static async register(snippetid, speed, acc, isMultiplayer, userid = null) {
        // INSERT INTO score SET snippetid=? speed=? acc=? userid=? 
        const insert_score_result = await con_pool.query("INSERT INTO score SET snippetid=?, speed=?, accuracy=?, userid=?, context=?",
            [snippetid, speed, acc, userid, (isMultiplayer ? "Multiplayer" : "Solo")]);
        const server_timestamp = await con_pool.query("SELECT UNIX_TIMESTAMP(time) AS time FROM score WHERE playid=?", insert_score_result.insertId);
        return new Score(insert_score_result.insertId, snippetid, speed, acc, server_timestamp[0].time, isMultiplayer ? "Multiplayer" : "Solo", userid);
    }
};

User.errors = errors;
module.exports.User = User;
module.exports.Score = Score;
