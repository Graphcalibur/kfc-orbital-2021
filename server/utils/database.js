
var util = require("util");
const { Pool } = require("pg");

const con_pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT
});

// Create an awaitable function that can make queries
con_pool.query = util.promisify(con_pool.query).bind(con_pool);
module.exports.con_pool = con_pool;
