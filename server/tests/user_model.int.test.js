const {User} = require('../models/User');

test('can retrieve user by username', async () => {
    const u = await User.from_username("abacaba123");
    expect(u.username).toBe("abacaba123");
});

const test_username = "pqrstuser";
const test_password = "weakpasswordLOL";

test('can register user', async () => {
    const u = await User.register(test_username, test_password);
    expect(u.username).toBe(test_username);
});

test('can reject duplicate registrations', async () => {
    expect.assertions(1);
    try {
        const u = await User.register(test_username, test_password);
    } catch (e) {
        expect(e).toBeInstanceOf(User.errors.UsernameAlreadyExistsError);
    }
});

test('can authenticate user', async () => {
    const u = await User.from_authentication(test_username, test_password);
    expect(u.username).toBe(test_username);
});

test('can reject wrong authentication', async () => {
    const wrong_password = "malingpassword";
    expect.assertions(1);
    try {
        const u = await User.from_authentication(test_username, wrong_password);
    } catch (e) {
        expect(e).toBeInstanceOf(User.errors.IncorrectPasswordError);       
    }
});

test('can reject non-existent users', async () => {
    const wrong_username = "pqrstuvser";
    expect.assertions(1);
    try {
        const u = await User.from_authentication(wrong_username, test_password);
    } catch (e) {
        expect(e).toBeInstanceOf(User.errors.NoUserExistsError);
    }
});

test('can create username mapping', async () => {
    const user_mapping = await User.username_id_mapping([1, 3]);
    const expected_mapping = new Map([
        [1, new User(1, "abacaba123")],
        [3, new User(3, "testuser")]
    ])
    expect(user_mapping).toEqual(expected_mapping);
})
