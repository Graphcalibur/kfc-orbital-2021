let {con_pool} = require('../utils/database');

afterAll(() => {
    con_pool.end();
});

