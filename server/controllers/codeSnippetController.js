const database = require('../utils/database');
const random = require('../utils/random');

exports.code_snippet = function (req, res) {
    const con = database.get_connection();

    con.query("SELECT COUNT(*) FROM code_snippet;", process_count_query);
    
    function process_count_query(err, result) {
        if (err) throw err;
        const code_snippet_count = result[0]["COUNT(*)"];
        const id_to_retrieve = random.randint(0, code_snippet_count - 1);
        con.query("SELECT * FROM code_snippet LIMIT ?, 1", [id_to_retrieve], 
            process_query_result);
    };


    function process_query_result(err, result) {
        if (err) throw err;
        res.json(result);
    };
};


