
/*  Class to model the status of participants in a race.
 */
let TypingStatus = class TypingStatus {
    /*  Constructor arguments:
     *  - snippet: The snippet used in the race.
     *  - init: An optional argument: an Object with line_no, current_line
     *      and mistypes properties. These initialize the TypingState
     *       with these respective values.
     */
    constructor(snippet, start_time, init) {
        const prev_state = init || {};
        this.mistypes = prev_state.mistypes || 0;
        this.line_no = prev_state.line_no || 0;
        this.current_line = prev_state.current_line || "";
        this.snippet = snippet;
        this.start_time = start_time;
        this.finish_time = null;
    }
    /* Check if this TypingState represents a finished state.
     */
    get is_finished() { 
        return this.line_no >= this.snippet.line_count;
    }
    /*  Return an object with only this TypingState's mistypes, line_no, and current_line
    *   properties.
     */
    get client_repr() {
        const {line_no, current_line, mistypes} = this;
        return {line_no, current_line, mistypes};
    }
    /* Accepts an object with mistypes, line_no, current_line properties,
     * and updates the TypingState to reflect those.
     */
    update_with(player_state) {
        this.mistypes = player_state.mistypes || this.mistypes;
        this.line_no = player_state.line_no || this.line_no;
        this.current_line = player_state.current_line || this.current_line;
    }
    /* Mark the TypingState as finished, setting the finish_time property.
     */
    mark_as_finished() {
        this.finish_time = new Date();
    }
    /* Return the WPM of this TypingState.
     * Returns undefined if the TypingState is not finished yet.
     */
    get speed() {
        if (!this.finish_time) return undefined;
        const duration_ms = this.finish_time.getTime() - this.start_time.getTime();
        const duration_mins = duration_ms / 60000;
        const word_count = this.snippet.length / 5;
        return word_count / duration_mins;
    }
    /* Return the accuracy of this TypingState. 
     * Returns undefined if the TypingState is not finished yet.
     */
    get acc() {
        if (!this.finish_time) return undefined;
        const code_length = this.snippet.length;
        const keystrokes = this.snippet.length + this.mistypes;
        return (code_length / (keystrokes)) * 100;
    }
    /* Return an object with speed, acc and time properties,
     * representing the finished state of the play.
     */
    get play_statistics() {
        return {speed: this.speed,
                acc: this.acc,
                time: this.finish_time};
    }
};

module.exports.TypingStatus = TypingStatus;