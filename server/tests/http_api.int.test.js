const { ExpectationFailed } = require('http-errors');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const test_port = process.env.TEST_SERVER_PORT || "6969";
const test_addr = process.env.TEST_SERVER_ADDRESS || "127.0.0.1";
const server_addr = `http://${test_addr}:${test_port}/api/`

test("can query code snippets", (done) => {
    const params = new URLSearchParams();
    params.append("lang", "C++");
    fetch(`${server_addr}/code/fetch?`
        + params)
        .then(res => res.json())
        .then(res => {
            expect(res).toEqual([
                {
                    id: 1,
                    language: "C++",
                    code: 'for (int i = 0; i < 10; ++i)\n    cout << i << endl;\n}'
                }
            ])
            done();
        })
});

test("can log in", (done) => {
    const params = new URLSearchParams();
    params.append("username", "abacaba123");
    params.append("password", "SpeedIAmSpeed");
    fetch(`${server_addr}/authuser`, {method: 'POST', body: params})
        .then(res => res.json())
        .then(res => {
            expect(res).toEqual({id: 1, username: 'abacaba123'});
            done();
        })
})