/* Utility function for making request-and-response messages.
 * Returns a Promise that resolves to a server response.
 * Parameters:
 *  - socket: A socket to make the query with.
 *  - message_type: The message type to send.
 *  - message_return_type: The type the server will use to send the return message.
 *  - data: The data to send.
 *  - timeout (default 5000ms): If no response is received by this duration, reject.
 */
module.exports.make_query_request = (socket, message_type, message_return_type, data, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        const timeoutID = setTimeout(() => {
            reject(new Error(`Query for ${message_type} timed out after ${timeout} ms`))
        }, timeout);
        socket.once(message_return_type, (msg) => {
            clearTimeout(timeoutID);
            resolve(msg);
        });
        socket.once('error', (msg) => {
            reject(msg);
        });
        socket.emit(message_type, data);
    });
};