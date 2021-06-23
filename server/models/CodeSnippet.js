const mysql = require('mysql2');
const {con_pool} = require('../utils/database');
const random = require('../utils/random');

/* Class to package code snippets.
 */
let CodeSnippet = class CodeSnippet {
    constructor(id, language, code) {
        this.id = id;
        this.language = language;
        this.code = code;
    }
    /* Returns the number of lines this snippet contains. */
    get line_count() {
        const newlines = this.code.match(/\n/g) || [];
        return newlines.length + 1;
    }
    /* Returns the number of keystrokes needed to type this snippet. */
    get length() {
        // Assume that every newline is a keystroke, and that whitespace is stripped.
        const lines = this.code.split('\n');
        const total_characters = lines.map(line => line.trim()).reduce((a, b) => a + b);
        return total_characters + lines.length - 1;
    }
    /* Retrieves a random snippet, following the parameters in the query object.
     * Returns either an empty array, or an array containing a single CodeSnippet.
     * The following properties are supported:
     * - lang: The programming langauge to fetch queries for.
     */
    static async get_random(query) {

        function build_conditions(params) {
            let conditions = [];
            let values = [];
            if (typeof params.lang !== "undefined") {
                conditions.push("language = ?");
                values.push(params.lang);
            }

            return {conditions: conditions.length ? 
                    conditions.join('AND') : '1',
                values: values};
        }

        const {conditions: cond, values: vals} = build_conditions(query);
        const count_query_result = await con_pool.query("SELECT COUNT(*) FROM code_snippet WHERE " + cond, vals);
        
        const code_snippet_count = count_query_result[0]["COUNT(*)"];
        const id_to_retrieve = random.randint(0, code_snippet_count - 1);
        const code_snippet = await con_pool.query("SELECT * FROM code_snippet WHERE " + cond + " LIMIT ?, 1", vals.concat([id_to_retrieve]));
        if (!code_snippet) {
            return [];
        } else {
            const result = code_snippet[0];
            return [new CodeSnippet(result.id, result.language, result.code)];
        }
    }
};

module.exports.CodeSnippet = CodeSnippet;