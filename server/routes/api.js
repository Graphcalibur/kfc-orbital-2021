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
    user_controller.check_authentication,
    user_controller.authuser);

router.get('/user/:username/testauth',
    user_controller.require_auth,
    user_controller.testauth
);

router.post('/logout', user_controller.logout);

module.exports = router;
