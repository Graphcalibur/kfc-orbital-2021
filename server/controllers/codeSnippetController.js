const {CodeSnippet} = require('../models/CodeSnippet');

exports.code_snippet = async function (req, res) {
    const cs = await CodeSnippet.get_random(req.query);
    res.json(cs);
};
