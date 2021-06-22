const {con_pool} = require('../utils/database');

module.exports = async () => {
    con_pool.end(function (err) {
        if (err) throw err;
    });
    process.env.DATABASE_NAME = process.env.__NON_TEST_DATABASE_NAME;
    global.__HTTP_SERVER__.close();
};
