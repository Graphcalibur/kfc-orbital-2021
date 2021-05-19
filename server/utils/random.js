/* Utility module for random number generation.
 * Uses the default JS PRNG.
 */

// Returns a random integer uniformly distributed between [min, max].
module.exports.randint = function(min, max) {
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
