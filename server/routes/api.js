var express = require('express');
var router = express.Router();

var code_snippet_controller = require('../controllers/codeSnippetController');
var user_controller = require('../controllers/userController');

/* GET code snippet. */
router.get('/code', code_snippet_controller.code_snippet);

router.post('/user/register', user_controller.register);

module.exports = router;
