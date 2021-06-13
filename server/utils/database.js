
var util = require("util");
var mysql = require("mysql2");

const config = {
  connectionLimit: 20,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

// Create a connection pool for the server to use
const con_pool = mysql.createPool(config);

// Create an awaitable function that can make queries
con_pool.query = util.promisify(con_pool.query).bind(con_pool);
module.exports.con_pool = con_pool;
module.exports.config = config
