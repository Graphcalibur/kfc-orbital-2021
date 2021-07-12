var express = require('express');
var passport = require('passport');
var argon2 = require('argon2');
var {Strategy: LocalStrategy} = require('passport-local');
var router = express.Router();

var code_snippet_controller = require('../controllers/codeSnippetController');
var database = require('../utils/database');
var user_controller = require('../controllers/userController');
var stat_controller = require('../controllers/statController');

/* GET code snippet. */
router.get('/code', code_snippet_controller.code_snippet);

/* Check permission list */
router.get('/permission-list/', 
    user_controller.require_auth(false),
    user_controller.permission_list);

/* Endpoints for registering and viewing statistics */
router.post('/stats/upload/:snippetid(\\d+)/:speed(\\d+)wpm/:acc/', stat_controller.upload);

router.get('/stats/:username/summary', user_controller.check_user_exists, stat_controller.summary);

router.get('/stats/:username/scorelist', user_controller.check_user_exists, stat_controller.scorelist);

router.get('/stats/allscores/', stat_controller.allscores);

/* Registration and authentication endpoints */
router.post('/register', user_controller.register);

router.post('/authuser',
    user_controller.check_authentication,
    user_controller.authuser);

router.get('/user/:username/testauth',
    user_controller.require_auth(true),
    user_controller.testauth
);

router.get('/current-login', user_controller.current_login);

router.post('/logout', user_controller.logout);

/* 404 for API */
router.use(function(req, res) {
    res.status(404);
    res.json({message: "API path not found", called_endpoint: req.originalUrl});
});

module.exports = router;
