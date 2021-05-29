var util = require('util');
var mysql = require('mysql2');

// Create a connection and connects to the database.
// Return the connection object after doing so.
module.exports.get_connection = function () {
    
    var connection = mysql.createConnection({
        host: "localhost",
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: "testdb"
    });

    connection.connect((err) => {
        if (!err) {
            console.log("Connected");
        } else {
            console.log("Connection failed");
            throw err;
        }
    });

    return connection;
};

const con_pool = mysql.createPool({
    connectionLimit: 20,
    host: "localhost",
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: "testdb"
});

con_pool.query = util.promisify(con_pool.query).bind(con_pool);

module.exports.con_pool = con_pool;

