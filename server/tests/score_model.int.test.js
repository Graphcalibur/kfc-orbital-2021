const {User, Score} = require('../models/User');

const test_userid = 1;
const test_username = 'abacaba123';
const CPP_SNIPPET_ID = 1;
const PYTHON_SNIPPET_ID = 2;
let registered_plays = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test('can register solo scores', async() => {
    const u = new User(test_userid, test_username);
    // These plays are in chronological order
    const snippet_ids = [CPP_SNIPPET_ID, CPP_SNIPPET_ID, PYTHON_SNIPPET_ID, PYTHON_SNIPPET_ID];
    const speeds =      [            98,             95,                83,                84];
    const accuracies =  [           100,           97.2,                96,              99.3];
    for (let i = 0; i < snippet_ids.length; ++i) {
        await sleep(1000); // The database assigns the timestamps so Jest can't mock this
        const s = await Score.register(snippet_ids[i], speeds[i], accuracies[i], false, u.id);
        expect(s.speed).toBe(speeds[i]);
        expect(s.acc).toBe(accuracies[i]);
        expect(s.snippetid).toBe(snippet_ids[i]);
        expect(s.context).toBe('Solo');
        expect(s.userid).toBe(u.id);
        registered_plays.push(s);
    }
});

test('can retrieve overall summary statistics', async () => {
    const u = new User(test_userid, test_username);
    const summary = await u.get_summary_data({lang: undefined, context: undefined, recent: undefined});
    expect(summary).toEqual({
        playcount: 4,
        speed: {average: 90, maximum: 98},
        accuracy: {average: 98.125, maximum: 100}
    });
});

test('can summarize only X most recent plays', async () => {
    const u = new User(test_userid, test_username);
    const summary = await u.get_summary_data({lang: undefined, context: undefined, recent: 3});
    expect(summary).toEqual({
        playcount: 4,
        speed: {average: 87.3333, maximum: 95},
        accuracy: {average: 97.5, maximum: 99.3}
    });
});

test('can retrieve full scorelist', async () => {
    const u = new User(test_userid, test_username);
    const play_window = await u.get_scorelist({}, 0, 20);
    const playcount = await u.get_scorecount({}, 0, 20);
    let reverse_chrono_plays = [...registered_plays].reverse();
    expect(play_window).toEqual(reverse_chrono_plays);
    expect(playcount).toBe(4);
});

test('can retrieve partial scorelist', async () => {
    const u = new User(test_userid, test_username);
    const play_window = await u.get_scorelist({}, 1, 2);
    let reverse_chrono_plays = [...registered_plays].reverse();
    expect(play_window.length).toBe(2);
    expect(play_window[0]).toEqual(reverse_chrono_plays[1]);
    expect(play_window[1]).toEqual(reverse_chrono_plays[2]);
    const playcount = await u.get_scorecount({}, 1, 2);
    expect(playcount).toBe(4);
});

test('can retrieve scorelist filtered for language', async () => {
    const u = new User(test_userid, test_username);
    const play_window = await u.get_scorelist({lang: 'Python'}, 0, 20);
    let reverse_chrono_plays = [...registered_plays].reverse();
    expect(play_window.length).toBe(2);
    expect(play_window[0]).toEqual(reverse_chrono_plays[0]);
    expect(play_window[1]).toEqual(reverse_chrono_plays[1]);
    const playcount = await u.get_scorecount({lang: 'Python'}, 0, 20);
    expect(playcount).toBe(2);
});

