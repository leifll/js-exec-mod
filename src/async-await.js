'use strict';

// The spec is found at https://tc39.es/ecma262/

// See https://stackoverflow.com/questions/17542740/is-it-accurate-to-say-javascript-is-a-single-thread-language
// The spec can be said to define ECMA script as single-threaded, since there's no mentioning at all
// about any thread-related issues. In particular, the event loop isn't mentioned in any way.
// Also, nothing is said about thread safety, concurrency, mutex, deadlock or anything of the kind.

// The way async/await work is specified in the Async Functions abstract operations defined in
// sections 27.7.5. It is also explained (but not defined), in plain text, in the page
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
// The examples below are taken from that page.

// The 'async' keyword creates a new promise that is not enqueued, but instead resolved with the
// result of the async block (27.7.5.2). This happens even if there's no 'wait' statement in the
// async function.

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

// ---------------- First example --------------------
// const resolveAfterOneSecond = () => {
//   console.log('ex 1, printout 2');
//   return new Promise((resolve) => {
//     console.log('ex 1, printout 3, delay after here');
//     setTimeout(() => {
//       console.log('ex 1, printout 4, delay before here')
//       resolve('ex 1, printout 5');
//     }, 1000);
//   });
// };

// const asyncCall = async () => {
//   console.log('ex 1, printout 1');
//   const result = await resolveAfterOneSecond();
//   console.log(result);
// };

// asyncCall();

// ---------------- Second example --------------------
// const moreThanOneAwait = async () => {
//   console.log('ex 2, printout 1');
//   const resultOfFirstPromise = await new Promise((resolve) => {
//     console.log('ex 2, printout 2, delay after here');
//     setTimeout(() => {
//       resolve('ex 2, printout 3, delay before here');
//     }, 1000);
//   });
//   console.log(resultOfFirstPromise);
//   const resultOfSecondPromise = await new Promise((resolve) => {
//     console.log('ex 2, printout 4, delay after here');
//     setTimeout(() => {
//       resolve('ex 2, printout 5, delay before here');
//     }, 1000);
//   });
//   console.log(resultOfSecondPromise);
//   console.log('ex 2, printout 6');
// };

// moreThanOneAwait();

// ---------------- Third example --------------------
// const eachAwaitStmtCreatesAPromiseThatsExecutedBeforeTheRestOfTheAsyncFunc = async () => {
//   const resultProm = new Promise((resolve) => setTimeout(() => resolve('never printed'), 1000));
//   const rejectProm = new Promise((_, reject) => setTimeout(() =>
//     reject(new Error('ex3, printout 1')), 500));
//   return [await resultProm, await rejectProm]; // Don't do this! Use Promise.all instead.
// };

// eachAwaitStmtCreatesAPromiseThatsExecutedBeforeTheRestOfTheAsyncFunc().catch(() => {
//   console.log('never printed since rejectProm fails before it\'s wired into the promise chain');
// });

// ---------------- Used in example 4-7 --------------------
const resolveAfterTwoSeconds = () => {
  console.log('starting slow promise');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('slow');
      console.log('slow promise is done');
    }, 2000);
  });
};

const resolveAfterOneSecond = () => {
  console.log('starting fast promise');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('fast');
      console.log('fast promise is done');
    }, 1000);
  });
};

// ---------------- Fourth example --------------------
// const sequentialStart = async () => {
//   console.log('== sequentialStart starts ==');

//   // 1. Start a timer, log after it's done
//   const slow = resolveAfterTwoSeconds();
//   console.log(await slow);

//   // 2. Start the next timer after waiting for the previous one
//   const fast = resolveAfterOneSecond();
//   console.log(await fast);

//   console.log('== sequentialStart done ==');
// };

// sequentialStart(); // after 2 seconds, logs 'slow', then after 1 more second, 'fast'

// ---------------- Fifth example --------------------
// const sequentialWait = async () => {
//   console.log('== sequentialWait starts ==');

//   // 1. Start two timers without waiting for each other
//   const slow = resolveAfterTwoSeconds();
//   const fast = resolveAfterOneSecond();

//   // 2. Wait for the slow timer to complete, and then log the result
//   console.log(await slow);
//   // 3. Wait for the fast timer to complete, and then log the result
//   console.log(await fast);

//   console.log('== sequentialWait done ==');
// };

// sequentialWait(); // after 2 seconds, logs 'slow' and then 'fast'

// ---------------- Sixth example --------------------
// const concurrent1 = async () => {
//   console.log('== concurrent1 starts ==');

//   // 1. Start two timers concurrently and wait for both to complete
//   const results = await Promise.all([
//     resolveAfterTwoSeconds(),
//     resolveAfterOneSecond(),
//   ]);
//   // 2. Log the results together
//   console.log(results[0]);
//   console.log(results[1]);

//   console.log('== concurrent1 done ==');
// };

// concurrent1(); // same as sequentialWait, after 2 seconds, logs 'slow' and then 'fast'

// ---------------- Seventh example --------------------
const concurrent2 = async () => {
  console.log('== concurrent2 starts ==');

  // 1. Start two timers concurrently, log immediately after each one is done
  await Promise.all([
    (async () => console.log(await resolveAfterTwoSeconds()))(),
    (async () => console.log(await resolveAfterOneSecond()))(),
  ]);
  console.log('== concurrent2 done ==');
};

concurrent2(); // after 1 second, logs 'fast', then after 1 more second, 'slow'
