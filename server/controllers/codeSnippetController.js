const mysql = require('mysql2');
const {con_pool} = require('../utils/database');
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

exports.code_snippet = async function (req, res) {
    
    const {conditions: cond, values: vals} = build_conditions(req.query);
    const count_query_result = await con_pool.query("SELECT COUNT(*) FROM code_snippet WHERE " + cond, vals);
    
    const code_snippet_count = count_query_result[0]["COUNT(*)"];
    const id_to_retrieve = random.randint(0, code_snippet_count - 1);
    const code_snippet = await con_pool.query("SELECT * FROM code_snippet WHERE " + cond + " LIMIT ?, 1", vals.concat([id_to_retrieve]));

    res.json(code_snippet);
};
