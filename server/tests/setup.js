const assert = require('assert');
const fs = require('fs');
const {exec} = require('child_process');

module.exports = async () => {
    require("dotenv").config();

    const testdb_backup_filename = 'tests/test_database.sql.backup';
    const testdb_filename = 'tests/test_database.sql';
    const test_db_name = process.env.TEST_DATABASE_NAME;

    // Sort of a safety to make sure tests don't touch any running production DB
    assert.notStrictEqual(process.env.DATABASE_NAME, test_db_name,
        "If you need to run tests on the same database as development," +
        "remove this assertion and try again.");


    let {config: setupConfig} = require('../utils/database');
    setupConfig.database = test_db_name;

    async function save_testdb_to_backup() {
        console.log("Saving current contents of " + test_db_name + " to " + testdb_backup_filename);
        return new Promise((resolve, reject) => {
            const {user, password, host, port, database} = setupConfig;
            exec(`mysqldump -u${user} -p${password} -h ${host} --port ${port} ${database} > ${testdb_backup_filename}`,
                (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    function redirect_database_operations() {
        process.env.__NON_TEST_DATABSE_NAME = process.env.DATABASE_NAME;
        process.env.DATABASE_NAME = test_db_name;
        console.log("Redirected all database operations to " + process.env.TEST_DATABASE_NAME);
    };

    function load_testdb() {
        return new Promise((resolve, reject) => {
            console.log("Loading test database");
            const {user, password, host, port, database} = setupConfig;
            exec(`mysql -u${user} -p${password} -h${host} --port ${port} ${database} < ${testdb_filename}`,
                (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    function setup_websocket_server() {
        const http = require('http');
        const {setup_server} = require('../socker/socketController');

        let http_server;
        const test_port = process.env.TEST_SERVER_PORT || "6969";
        const test_addr = process.env.TEST_SERVER_ADDRESS || "127.0.0.1";

        http_server = http.createServer();
        setup_server(http_server);
        http_server.listen(test_port); 

        global.__HTTP_SERVER__ = http_server;
    }

    redirect_database_operations();
    await save_testdb_to_backup();
    await load_testdb();
    setup_websocket_server();

    console.log("Finished global setup");
};
