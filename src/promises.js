'use strict';

// The spec is found at https://tc39.es/ecma262/

// See https://stackoverflow.com/questions/17542740/is-it-accurate-to-say-javascript-is-a-single-thread-language
// The spec can be said to define ECMA script as single-threaded, since there's no mentioning at all
// about any thread-related issues. In particular, the event loop isn't mentioned in any way.
// Also, nothing is said about thread safety, concurrency, mutex, deadlock or anything of the kind.

// Promise Objects are covered in section 27.2
// A Promise is an object that is used as a placeholder for the eventual results of a deferred
// (and possibly asynchronous) computation.

// Any Promise is in one of three mutually exclusive states: fulfilled, rejected, and pending:
// 1. A promise p is fulfilled if p.then(f, r) will immediately enqueue a Job to call the
//    function f.
// 2. A promise p is rejected if p.then(f, r) will immediately enqueue a Job to call the function r.
// 3. A promise is pending if it is neither fulfilled nor rejected.

// A Promise is said to be settled if it is not pending, i.e. if it is either fulfilled or rejected.

// A Promise is resolved if it is settled or if it has been “locked in” to match the state of
// another Promise. Attempting to resolve or reject a resolved Promise has no effect. A Promise
// is unresolved if it is not resolved. An unresolved Promise is always in the pending state.
// A resolved Promise may be pending, fulfilled or rejected.

// A PromiseCapability Record (27.2.1.1) is a Record value used to encapsulate a Promise or
// promise-like object along with the functions that are capable of resolving or rejecting
// that promise. It consists of the following:
// 1. [[Promise]] An object that is usable as a promise.
// 2. [[Resolve]] A Function Object representing the function that is used to resolve the
//                given promise.
// 3. [[Reject]]  A Function Object representing the function that is used to reject the
//                given promise.

// A PromiseReaction Record (27.2.1.2) is a Record value used to store information about how a
// promise should react when it becomes resolved or rejected with a given value. It has
// the following fields:
// 1. [[Capability]] is a PromiseCapability Record representing capabilities of the
//                   promise for which this record provides a reaction handler.
// 2. [[Type]]       is one of Fulfill or Reject. The [[Type]] is used when [[Handler]]
//                   is empty to allow for behavior specific to the settlement type.
// 3. [[Handler]]    is a JobCallback Record representing the function that should be
//                   applied to the incoming value, and whose return value will govern
//                   what happens to the derived promise. If [[Handler]] is empty, a
//                   function that depends on the value of [[Type]] will be used instead.

// A JobCallback Record (9.5.1) is a Record value used to store a function object. To propagate
// state, Job Abstract Closures should not capture and call function objects directly. Instead,
// they should use HostMakeJobCallback and HostCallJobCallback.

// The way promises work is specified in the Promise abstract operations defined in
// sections 27.2.1-27.2.5. It is also explained (but not defined), in plain text,
// in the following pages:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise

// In brief, as can be seen in the pages above and in the specification of
// Promise abstract operations, it works as follows.
// 1. A new Promise is created with the statement 'new Promise(executor)'. The executor argument
//    must be a function object. It is called by the Promise constructor, for initiating and
//    reporting completion of the action represented by the newly created Promise. The executor
//    takes two arguments, resolve and reject. These are functions that may be used by the
//    executor function to report completion or failure of the deferred computation. Returning
//    from the executor function does not mean that the deferred action has been
//    completed. (27.2.3.1)
// 2. The resolve function that is passed to an executor function passed to the Promise constructor
//    accepts a single argument. The executor code may eventually call the resolve function to
//    resolve the associated Promise. The argument passed to the resolve function represents the
//    eventual value of the deferred action and can be either the actual fulfillment value or
//    another promise which will provide the value if it is fulfilled. (27.2.3.1)
// 3. The reject function that is passed to an executor function passed to the Promise constructor
//    accepts a single argument. The executor code may eventually call the reject function to
//    indicate that the associated Promise is rejected and will never be fulfilled. The argument
//    passed to the reject function is used as the rejection value of the promise. Typically it
//    will be an Error object. (27.2.3.1)
// 4. Note that the resolve and reject functions passed to the executor function
//    (bullets 1-3 above) are not part of the written program. They are instead generated by the
//    JS Host. The resolve function will create and enqueue a new Job, that either returns
//    it's argument if the argument isn't a promise, or executes it's argument if the argument
//    is a promise. (27.2.3.1, 27.2.1.3, 27.2.1.3.2)
// 5. The 'then' function in the promise prototype performs the following steps:
//    a. Creates a new PromiseCapability Record with a promise that doesn't do anything. Remember
//       bullet 4 above, the resolve and reject functions of this PromiseCapability are the
//       generated functions described there.
//    b. Creates JobCallback Records representing the resolve and reject records passed to
//       the 'then' method.
//    c. Creates PromiseReaction Records for the JobCallback Records created in bullet b above.
//       The [[Capability]] field of these Records is the PromiseCapability created in
//       bullet a above.
//    d. If the promise on which 'then' was called is pending, appends the PromiseReaction records
//       created in bullet c to its lists of pending fulfill/reject reactions. If, on the other
//       hand, the promise on which 'then' was called is fulfilled/rejected, enqueue Jobs that
//       will perform the fulfill/reject reactions created in bullet c, passing the result value
//       of the promise on which 'then' was called to the resolve/reject function represented by
//       the enqueued Job.
//    e. Return the promise created in bullet a.

// In brief, all of the above can be summarized as follows: Code is executed sequentially
// from top to bottom, but all calls to resolve or reject in a promise constructor or to
// then/catch/finally are enqueued and executed when the execution context stack is empty.

// When looking at examples below, remember thst the following are all the same:
// (x) => x*2;
// (x) => {return x*2}
// function myFunc(x) {return x*2}
console.log('ex 1, printout 1');
const promiseOuter = new Promise((resolveOuter, rejectOuter) => {
  console.log('ex 1, printout 2');
  const promiseInner = new Promise((resolveInner, rejectInner) => {
    console.log('ex 1, printout 3');
    resolveInner('from inner promise');
  });
  promiseInner.then((result) => {
    console.log('ex 1, printout 6');
    console.log(result);
  //   return result;
  // }).then((result) => {
  //   console.log('ex 1, printout 6b');
  //   console.log(result);
  //   return result;
  }).then((result) => {
    console.log('ex 1, printout 7');
    console.log(result);
    resolveOuter(result);
  });
  console.log('ex 1, printout 4');
});
promiseOuter.then((result) => {
  console.log('ex 1, printout 8');
  console.log(result);
  return result;
}).then((result) => {
  console.log('ex 1, printout 9');
  console.log(result);
});
console.log('ex 1, printout 5');

// Useful static methods in Promise follow below.

// Promise.all takes an iterable of promises as input and returns a single Promise.
// This returned promise fulfills when all of the input's promises fulfill, with an
// array of the fulfillment values. It rejects when any of the input's promises reject,
// with this first rejection reason.
Promise.all([
  new Promise((resolve, reject) => resolve('ex 2, from first')),
  new Promise((resolve, reject) => resolve('ex 2, from second')),
  new Promise((resolve, reject) => resolve('ex 2, from third')),
]).then((result) => result.forEach((val) => console.log(val)));

// Promise.allSettled takes an iterable of promises as input and returns a single Promise.
// This returned promise fulfills when all of the input's promises settle, with an
// array of objects that describe the outcome of each promise.
Promise.allSettled([
  new Promise((resolve, reject) => resolve('ex 3, from first')),
  new Promise((resolve, reject) => reject(new Error('ex 3, from second'))),
  new Promise((resolve, reject) => resolve('ex 3, from third')),
]).then((result) => result.forEach((val) => console.log(val)));

// Promise.any takes an iterable of promises as input and returns a single Promise.
// This returned promise fulfills when any of the input's promises fulfill, with
// this first fulfillment value. It rejects when all of the input's promises reject),
// with an AggregateError containing an array of rejection reasons.
Promise.any([
  new Promise((resolve, reject) => resolve('ex 4, from first')),
  new Promise((resolve, reject) => resolve('ex 4, from second')),
  new Promise((resolve, reject) => resolve('ex 4, from third')),
]).then((result) => console.log(result));

// Promise.race takes an iterable of promises as input and returns a single Promise.
// This returned promise settles with the eventual state of the first promise that settles.

// Promise.reject returns a new Promise object that is rejected with the given reason.

// Promise.resolve returns a Promise object that is resolved with the given value. If the
// value is a thenable (i.e. has a then method), the returned promise will "follow" that thenable,
// adopting its eventual state; otherwise, the returned promise will be fulfilled with the value.
// Generally, if you don't know if a value is a promise or not, Promise.resolve(value) it instead
// and work with the return value as a promise.
Promise.resolve(
    new Promise((resolve, reject) => resolve('ex5 printout 1'))
).then((result) => console.log(result));
Promise.resolve('ex5 printout 2').then((result) => console.log(result));

// As can perhaps be seen in the output, printouts that are unrelated seem to appear
// in the wrong order. Can it be that the implementation is allowed to change execution order
// of statements as long as it doesn't violate the spec? That's allowed in Java by the Java spec.

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop

// https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick#what-is-the-event-loop
