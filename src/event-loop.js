'use strict';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop

// https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick#what-is-the-event-loop

// The two links above give an overview of the event loop. Note that the event loop isn't mentioned
// in the spec, instead it's Implementation-Defined.

// The event loop has a set of phases, each of which has its own event queue. When a phase is
// entered, the events in that phase's queue are executed in FIFO order until the queue is
// empty, or the time allowed to stay in that phase has passed. An event is always executed until
// the call stack is empty, no function is ever preempted.

// The most important phases of the event loop are 'timers', 'poll' and 'check'. The 'timers' phase
// handles timers started with calls to setTimeout. The 'poll' phase handles I/O events. The
// 'check' phase handles calls to setImmediate. Note that the 'check' phase comes immediately after
// the 'poll' phase. This means setImmediate calls are handled before setTimeout calls, when both
// are made in I/O callbacks.

// process.nextTick schedules a callback that will be handled immediately after the current event
// has been handled, regardless of event loop phase. This means process.nextTick is independent
// of event loops phases, it has its own queue that is separate from the queues of the event
// loop phases.
