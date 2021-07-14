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

exports.permission_list = async function(req, res) {
    res.json(await req.user.permission_list);
}

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

/** Middleware for a login endpoint.
 * Checks that the given credentials are correct. Returns a 401 if they are not correct.
 * Only passes control to the next handler if authentication is correct.
 * @type {Function}
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

/** Middleware for a protected endpoint.
 * Checks that the session has a given login. Returns a 401 if not.
 * Only passes control to the next handler if there is a valid login.
 * @param {Boolean} check_username Set this to true if the username
 *  of the request should be checked, and false if it is only the presence
 *  of a valid login thatis being checked.
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

/** Middleware for permission checking.
 *  Assumes that there is a currently logged in user,
 *  and checks that the logged in user has the permission.
 *  If yes, continue the chain; if no, return 404.
 *  @param {String} permission_name
 *  @returns {Function}
 * 
 */
exports.check_permission = function(permission_name) {
    return async function(req, res, next) {
        if (await req.user.has_permission(permission_name)) {
            next();
        } else {
            res.status(401);
            res.json({message: "Current user does not have valid permissions",
                missing_permission: permission_name});
        }
    }
};

/** Middleware to check that user exists.
 * Requires that the route has req.params.username set up.
 * Returns a 404 if not, proceeds with the chain otherwise.
 * @type {Function}
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
