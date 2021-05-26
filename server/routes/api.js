var express = require('express');
var passport = require('passport');
var argon2 = require('argon2');
var {Strategy: LocalStrategy} = require('passport-local');
var router = express.Router();

var code_snippet_controller = require('../controllers/codeSnippetController');
var database = require('../utils/database');
var user_controller = require('../controllers/userController');

/* GET code snippet. */
router.get('/code', code_snippet_controller.code_snippet);

router.post('/register', user_controller.register);

router.post('/authuser',
    user_controller.auth_username_password_middleware,
    user_controller.authenticate);

router.get('/user/:username/testauth',
    function(req, res) {
        if (req.user && req.params.username === req.user) {
            res.json("Auth OK");
        } else {
            res.status(401);
            res.json({"message": "No valid login found"});
        }
    }
);

router.post('/logout', user_controller.logout);

module.exports = router;
