/* Utility module for randomness.
 */

// Returns a random integer uniformly distributed between [min, max].
// Uses the default JS PRNG.
module.exports.randint = function(min, max) {
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const crypto = require('crypto');

// Generate byteLength random bytes, and base64 encode the result.
// Uses the crypto module.
module.exports.crypto_random_string = function (byteLength) {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(byteLength, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer.toString("base64"));
            }
        });
    });
};
