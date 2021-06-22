let {con_pool} = require('../utils/database');

// https://stackoverflow.com/a/54175600 this makes mysql2 play nicely with jest
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

afterAll(() => {
    con_pool.end();
});

