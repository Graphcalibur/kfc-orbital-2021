const mysql = require('mysql2');
const argon2 = require('argon2');
const passport = require('passport');
const {Strategy: LocalStrategy} = require('passport-local');

const database = require('../utils/database');
const random = require('../utils/random');


/* Controllers for the respective endpoints */
exports.code_snippet = function (req, res) {
    const con = database.get_connection();
    
    const {conditions: cond, values: vals} = build_conditions(req.query);
    con.query("SELECT COUNT(*) FROM code_snippet WHERE " + cond, vals, process_count_query);
    
    function process_count_query(err, result) {
        if (err) throw err;
        const code_snippet_count = result[0]["COUNT(*)"];
        const id_to_retrieve = random.randint(0, code_snippet_count - 1);
        con.query("SELECT * FROM code_snippet WHERE " + cond + " LIMIT ?, 1", vals.concat([id_to_retrieve]), 
            process_query_result);
    };


    function process_query_result(err, result) {
        if (err) throw err;
        con.end();
        res.json(result);
    };
};

exports.register = async function(req, res) {
    const {username, password} = req.body;
    const existing_usernames = await database.con_pool.query("SELECT COUNT(*) FROM user WHERE username = ?", username);
    console.log(existing_usernames);
    const existing_usernames_count = existing_usernames[0]["COUNT(*)"];
    if (existing_usernames_count > 0) {
        res.status(409); // Conflict due to existing username
        res.json({"error_msg": "Username already exists"});
    } else {
        const insert_user_result = await database.con_pool.query("INSERT INTO user SET username=?", username);
        const new_user_id = insert_user_result.insertId;
        const hashed_pw = await argon2.hash(password);
        const insert_pw_result = await database.con_pool.query("INSERT INTO user_password SET userid=?, password_hash=?", [new_user_id, hashed_pw]);
        res.json({"status": "OK"});
    }
};

exports.authuser = function(req, res) {
    res.json({username: req.user});
};

exports.testauth = function(req, res) {
    res.send("Auth OK");
};

exports.logout = function(req, res) {
    req.logout();
    res.send("Logged out");
};

// Promises an object with a `success` attribute, set to True iff the authentication succeeds.
// If this is false, it will contain a `message` attribute, detailing the reason why.
// If this is true, it will contain a `user` attribute, containing the authenticated user.
async function authenticateUser(username, password) {
    const user_id_results = await database.con_pool.query("SELECT id FROM user WHERE username = ?", username);
    if (user_id_results.length === 0) {
        return {success: false, message: "No such user"};
    } else {
        const userid = user_id_results[0].id;
        const saved_hash = await database.con_pool.query("SELECT password_hash FROM user_password WHERE userid = ?", userid)
        if (saved_hash.length !== 1) {
            return {success: false, message: "Internal error occurred"};
        } else if (await argon2.verify(saved_hash[0].password_hash, password)) {
            return {success: true, user: username};
        } else {
            return {success: false, message: "Incorrect password"};
        }
    }
}

/* Help passport handle authentication */
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(id, cb) {
    cb(null, id);
});

passport.use(new LocalStrategy(
    function(username, password, cb) {
        authenticateUser(username, password).then((result) => {
            if (result.success) {
                cb(null, result.user);
            } else {
                cb(null, false, {message: result.message});
            }
        });
    }
));

/* Middleware for a login endpoint.
 * Checks that the given credentials are correct. Returns a 401 if they are not correct.
 * Only passes control to the next handler if authentication is correct.
 */
exports.check_authentication = function(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (user) {
            req.login(user, function(err) {
                if (err) return next(err);
                return next();
            });
        } else {
            res.status("401");
            res.json(info);
        }
    })(req, res, next);
};

/* Middleware for a protected endpoint.
 * Checks that the session has a given login. Returns a 401 if not.
 * Only passes control to the next handler if there is a valid login.
 */
exports.require_auth = function(req, res, next) {
    if (req.user && req.params.username === req.user) {
        next();
    } else {
        res.status(401);
        res.json({message: "No valid login found"});
    }
};

