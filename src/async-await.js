'use strict';

// The spec is found at https://tc39.es/ecma262/

// See https://stackoverflow.com/questions/17542740/is-it-accurate-to-say-javascript-is-a-single-thread-language
// The spec can be said to define ECMA script as single-threaded, since there's no mentioning at all
// about any thread-related issues. In particular, the event loop isn't mentioned in any way.
// Also, nothing is said about thread safety, concurrency, mutex, deadlock or anything of the kind.

// The way async/await work is specified in the Async Functions abstract operations defined in
// sections 27.7.5. It is also explained (but not defined), in plain text, in the page
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

// The 'async' keyword creates a new promise that is not enqueued, but instead resolved with the
// result of the async block (27.7.5.2).

// The expression that's awaited with an 'await' keyword is executed synchronously, without
// promises. However, the 'await' keyword creates a new promise that's resolved with the result
// of the wait expression, and calls 'then' on this newly created promise. The value passed to
// this 'then' call is a function containing the remaining part of the async function's
// body (27.7.5.3).

// The fact that the await expression is executed synchronously, as stated above, makes it seem
// like 'await' makes the code completely synchronous, blocking the entire execution while the
// await expression is being executed. This is however not true, since the await expression
// itself is expected to return a promise, that's returned asynchronously. This is the very
// purpose, the intended use, of the 'await' keyword.

// WRITE EXAMPLES HERE

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop

// https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick#what-is-the-event-loop
