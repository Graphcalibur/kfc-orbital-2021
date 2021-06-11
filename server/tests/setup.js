const assert = require('assert');
const mysqldump = require('mysqldump');

const fs = require('fs');
const {exec} = require('child_process');

module.exports = async () => {
    require("dotenv").config();

    const testdb_backup_filename = 'tests/test_database.sql.backup';
    const testdb_filename = 'tests/test_database.sql';
    const test_db_name = process.env.TEST_DATABASE_NAME;

    // Sort of a safety to make sure tests don't touch any running production DB
    assert.notStrictEqual(process.env.DATABASE_NAME, test_db_name,
        "The test database name should be different from the regular database name.\n" +
        "If you are 100% sure you want to run tests on the regular database, " +
        "comment this assertion out and try again.");


    let {config: setupConfig} = require('../utils/database');
    setupConfig.database = test_db_name;

    function save_testdb_to_backup() {
        console.log("Saving current contents of " + test_db_name + " to " + testdb_backup_filename);
        mysqldump({
            connection: setupConfig,
            dumpToFile: testdb_backup_filename
        });
    };

    function redirect_database_operations() {
        process.env.DATABASE_NAME = test_db_name;
        console.log("Redirected all database operations to " + process.env.TEST_DATABASE_NAME);
    };

    function load_testdb() {
        return new Promise((resolve, reject) => {
            console.log("Loading test database");
            exec(`mysql -u${setupConfig.user} -p${setupConfig.password} -h${setupConfig.host} ${setupConfig.database} < ${testdb_filename}`,
                (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };
    redirect_database_operations();
    save_testdb_to_backup();
    await load_testdb();

    console.log("Finished global setup");
};
