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

