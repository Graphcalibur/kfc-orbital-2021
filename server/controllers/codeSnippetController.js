const mysql = require('mysql2');
const database = require('../utils/database');
const random = require('../utils/random');

function build_conditions(params) {
    let conditions = [];
    let values = [];
    if (typeof params.lang !== "undefined") {
        conditions.push("language = ?");
        values.push(params.lang);
    }

    return {conditions: conditions.length ? 
            conditions.join('AND') : '1',
        values: values};
}

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


