var util = require('util');
var mysql = require('mysql2');

let connection_settings = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 20
};

// Create a connection and connects to the database.
// Return the connection object after doing so.
module.exports.get_connection = function () {
    
    var connection = mysql.createConnection(connection_settings);

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

const con_pool = mysql.createPool(connection_settings);

con_pool.query = util.promisify(con_pool.query).bind(con_pool);

module.exports.con_pool = con_pool;

