const { CodeSnippet } = require('../models/CodeSnippet');

test('can properly compute line count', () => {
    const cs = new CodeSnippet(10, "Brainfuck", 
        "++++++++[>++++[>++>+++>+++>+<<<<-]\n" + 
        "   >+>+>->>+[<]<-]\n" +
        ">>.>---.+++++++..+++.>>\n" + 
        ".<-.<.+++.------.--------.>>+.>++.")
    expect(cs.line_count).toBe(4);
});

test('can properly compute length', () => {
    const cs = new CodeSnippet(10, "Brainfuck", 
        "++++++++[>++++[>++>+++>+++>+<<<<-]\n" + 
        "   >+>+>->>+[<]<-]\n" +
        ">>.>---.+++++++..+++.>>\n" + 
        ".<-.<.+++.------.--------.>>+.>++.")
    expect(cs.length).toBe(109);
})