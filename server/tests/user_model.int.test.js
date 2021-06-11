const {con_pool} = require('../utils/database')
const {User} = require('../models/User');

test('can retrieve user by username', async () => {
    const u = await User.from_username("abacaba123");
    expect(u.username).toBe("abacaba123");
});

