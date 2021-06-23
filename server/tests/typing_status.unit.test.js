const {TypingStatus} = require('../models/TypingStatus');

const mock_snippet = {
    id: 10,
    language: "Brainfuck",
    code: "++++++++[>++++[>++>+++>+++>+<<<<-]\n" + 
        "   >+>+>->>+[<]<-]\n" +
        ">>.>---.+++++++..+++.>>\n" + 
        ".<-.<.+++.------.--------.>>+.>++.",
    length: 109,
    line_count: 4
};
const fixed_time = new Date(2069, 4, 20, 6, 9, 42, 0);

jest.useFakeTimers(); // TOKI WO TOMAREEEEEEEE

beforeEach(() => {
    jest.setSystemTime(fixed_time);
});

test('can set and get client representation', () => {
    let ts1 = new TypingStatus(mock_snippet, fixed_time, {});
    expect(ts1.snippet).toEqual(mock_snippet);
    expect(ts1.start_time).toEqual(fixed_time);
    expect(ts1.finish_time).toBeNull();
    expect(ts1.client_repr).toEqual({mistypes: 0, line_no: 0, current_line: ""});
    ts1.update_with({mistypes: 1, line_no: 0, current_line: "++++-"});
    expect(ts1.client_repr).toEqual({mistypes: 1, line_no: 0, current_line: "++++-"});
});

test('can correctly reflect partial progress', () => {
    let ts = new TypingStatus(mock_snippet, fixed_time, {});
    jest.advanceTimersByTime(2000);
    ts.update_with({mistypes: 4, line_no: 2, current_line: ">>.>---.+++++++..+++.>>"});
    expect(ts.is_finished).toBe(false);
    expect(ts.speed).toBeUndefined();
    expect(ts.acc).toBeUndefined();
    expect(ts.client_repr).toEqual({mistypes: 4, line_no: 2, current_line: ">>.>---.+++++++..+++.>>"});
});

test('can correctly reflect finished state', () => {
    let ts = new TypingStatus(mock_snippet, fixed_time, {});
    jest.advanceTimersByTime(6500);
    ts.update_with({mistypes: 4, line_no: 3, current_line: ".<-.<.+++.------.--------.>>+.>++."});
    ts.mark_as_finished();
    expect(ts.is_finished).toBe(true);
    expect(ts.speed).toBeCloseTo(201.230769);
    expect(ts.acc).toBeCloseTo(96.46);
    expect(ts.play_statistics.speed).toBeCloseTo(201.230769);
    expect(ts.play_statistics.acc).toBeCloseTo(96.46);
});

