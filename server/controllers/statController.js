const mysql = require('mysql2');
const {con_pool} = require('../utils/database');
const {User, Score} = require('../models/User.js');

module.exports.upload = async function(req, res) {
    const {snippetid, speed, acc} = req.params;
    const isMulti = false;
    const result = await Score.register(snippetid, speed, acc, isMulti, req.user ? req.user.id : null);
    res.json(result);
};

module.exports.summary = async function(req, res) {
    const user = await User.from_username(req.params.username); 
    const summary_stats = await user.get_summary_data();
    res.json(summary_stats);
};

module.exports.scorelist = async function(req, res) {
    const MAX_COUNT = 20;
    const user = await User.from_username(req.params.username);
    const filters = {lang: req.query.lang || null};
    const from = Number(req.query.from) || 0;
    const count = Math.min(MAX_COUNT, Number(req.query.count) || MAX_COUNT);
    const scorecount = await user.get_scorecount(filters);
    const scorelist = await user.get_scorelist(filters, from, count);
    res.json({playcount: scorecount,
              score_window: scorelist});
};
