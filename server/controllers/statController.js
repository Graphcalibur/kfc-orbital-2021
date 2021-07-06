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
    const filters = {lang: req.query.lang || null,
                    context: req.query.context || null,
                    recent_count: req.query.recent ? Number(req.query.recent) : undefined};
    const summary_stats = await user.get_summary_data(filters);
    res.json(summary_stats);
};

module.exports.scorelist = async function(req, res) {
    const MAX_COUNT = 20;
    const user = await User.from_username(req.params.username);
    const filters = {lang: req.query.lang || null,
                     context: req.query.context || null};
    const from = Number(req.query.from) || 0;
    const count = Math.min(MAX_COUNT, Number(req.query.count) || MAX_COUNT);
    const scorecount = await user.get_scorecount(filters);
    const scorelist = await user.get_scorelist(filters, from, count);
    res.json({playcount: scorecount,
              score_window: scorelist});
};

module.exports.allscores = async function(req, res) {
    const time_window = req.timewindow || 86400; // number of seconds in a day
    const recent_scores = await Score.all_recent_scores(time_window);
    const unique_user_ids = [...new Set(recent_scores.map(score => score.userid))];
    const username_mapping = await User.username_id_mapping(unique_user_ids);
    const attach_username = (score) => { // Helper function that adds username information
        let score_with_username = score;
        score_with_username.username = username_mapping.get(score.userid).username;
        return score_with_username;
    };
    res.json(recent_scores.map(attach_username));
};