/* Utility module for randomness.
 */

// Returns a random integer uniformly distributed between [min, max].
// Uses the default JS PRNG.
const randint = (min, max) => {
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
};
module.exports.randint = randint;

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

// Choose an element at random from a non-empty list. 
// Uses default PRNG.
const choice = (elements) => {
    if (!elements.length) {
        throw Error(elements.toString(), "is empty list");
    }
    let idx = module.exports.randint(0, elements.length - 1);
    return elements[idx];
};
module.exports.choice = choice;

// Given a string S of characters, and a length L,
// generate a string of length L whose characters come from 
const random_string = (alphabet, length) => {
    return Array.from({length: length}, i => choice(alphabet)).join("");
};
module.exports.random_string = random_string;
