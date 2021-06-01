const mysql = require('mysql2');
const argon2 = require('argon2');
const passport = require('passport');
const {Strategy: LocalStrategy} = require('passport-local');

const {con_pool} = require('../utils/database');
const random = require('../utils/random');
const User = require('../models/User.js');

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
            .catch((error) => cb(null, false, {message: error.message}));
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
    if (req.user && req.params.username === req.user.username) {
        next();
    } else {
        res.status(401);
        res.json({message: "No valid login found"});
    }
};

