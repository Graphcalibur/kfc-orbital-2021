const mysql = require('mysql2');
const argon2 = require('argon2');
const passport = require('passport');
const {Strategy: LocalStrategy} = require('passport-local');

const {con_pool} = require('../utils/database');
const random = require('../utils/random');
const {User} = require('../models/User.js');

/* Controllers for the respective endpoints */
exports.register = async function(req, res) {
    const {username, password} = req.body;
    try {
        let new_user = await User.register(username, password);
        console.log(new_user);
        res.json(new_user);
    } catch (e) {
        console.log("caught");
        console.log(e);
        if (e instanceof User.errors.UsernameAlreadyExistsError) {
            res.status(409);
            res.json({message: "User already exists"});
        } else {
            throw e;
        }
    }
};

exports.authuser = function(req, res) {
    res.json(req.user);
};

exports.testauth = function(req, res) {
    res.send("Auth OK");
};

exports.logout = function(req, res) {
    req.logout();
    res.send("Logged out");
};

exports.current_login = function(req, res) {
    if (req.user) {
        res.json(req.user);
    } else {
        res.json(null);
    }
};

/* Help passport handle authentication */
passport.serializeUser(function (user, cb) {
    cb(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, cb) {
    const {id, username} = JSON.parse(user);
    cb(null, new User(id, username));
});

passport.use(new LocalStrategy(
    function(username, password, cb) {
        User.from_authentication(username, password)
            .then((user) => cb(null, user))
            .catch(function (err) {
                if (User.errors.is_user_error(err)) {
                    cb(null, false, {message: err.message});
                } else {
                    throw err;
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
exports.require_auth = function(check_username) {
    return function(req, res, next) {
        if (req.user && (!check_username || req.params.username === req.user.username)) {
            next();
        } else {
            res.status(401);
            res.json({message: "No valid login found"});
        }
    };
};

/* Middleware to check that user exists.
 * Requires that the route has req.params.username set up.
 * Returns a 404 if not, proceeds with the chain otherwise.
 */
exports.check_user_exists = async function(req, res, next) {
    try {
        const u = await User.from_username(req.params.username);
        next();
    } catch (e) {
        if (e instanceof User.errors.NoUserExistsError) {
            res.status(404);
            res.json({message: e.message});
        } else {
            throw e;
        }
    }
};
