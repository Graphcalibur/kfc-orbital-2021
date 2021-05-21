var express = require('express');
var router = express.Router();

var code_snippet_controller = require('../controllers/codeSnippetController');

/* GET code snippet. */
router.get('/code', code_snippet_controller.code_snippet);

module.exports = router;
