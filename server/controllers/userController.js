const mysql = require('mysql2');
const argon2 = require('argon2');

const database = require('../utils/database');
const random = require('../utils/random');


exports.code_snippet = function (req, res) {
    const con = database.get_connection();
    
    const {conditions: cond, values: vals} = build_conditions(req.query);
    con.query("SELECT COUNT(*) FROM code_snippet WHERE " + cond, vals, process_count_query);
    
    function process_count_query(err, result) {
        if (err) throw err;
        const code_snippet_count = result[0]["COUNT(*)"];
        const id_to_retrieve = random.randint(0, code_snippet_count - 1);
        con.query("SELECT * FROM code_snippet WHERE " + cond + " LIMIT ?, 1", vals.concat([id_to_retrieve]), 
            process_query_result);
    };


    function process_query_result(err, result) {
        if (err) throw err;
        con.end();
        res.json(result);
    };
};

exports.register = async function(req, res) {
    const {username, password} = req.body;
    const existing_usernames = await database.con_pool.query("SELECT COUNT(*) FROM user WHERE username = ?", username);
    console.log(existing_usernames);
    const existing_usernames_count = existing_usernames[0]["COUNT(*)"];
    if (existing_usernames_count > 0) {
        res.status(409); // Conflict due to existing username
        res.json({"reason": "Username already exists"});
    } else {
        const insert_user_result = await database.con_pool.query("INSERT INTO user SET username=?", username);
        const new_user_id = insert_user_result.insertId;
        const hashed_pw = await argon2.hash(password);
        const insert_pw_result = await database.con_pool.query("INSERT INTO user_password SET userid=?, password_hash=?", [new_user_id, hashed_pw]);
        res.json({"status": "OK"});
    }
};


