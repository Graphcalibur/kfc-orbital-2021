const {con_pool} = require('../utils/database');

module.exports = async () => {
    con_pool.end(function (err) {
        if (err) throw err;
    });
};
