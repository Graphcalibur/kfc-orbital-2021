var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "[PLACEHOLDER]",
    password: "[PLACEHOLDER]",
    database: "[PLACEHOLDER]"
});

exports.code_snippet = function (req, res) {
    process_sql_result = function(err, result) {
        if (err) throw err;
        res.send(result);
    };

    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM code_snippet;", process_sql_result);
    });
};


