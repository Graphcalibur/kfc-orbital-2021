const mysql = require('mysql2');
const {con_pool} = require('../utils/database');
const {User, Score} = require('../models/User.js');

module.exports.upload = async function(req, res) {
    const {snippetid, speed, acc} = req.params;
    const result = await Score.register(snippetid, speed, acc, req.user ? req.user.id : null);
    res.json(result);
};

module.exports.summary = async function(req, res) {
    const user = await User.from_username(req.params.username); 
    const summary_stats = await user.get_summary_data();
    res.json(summary_stats);
};

