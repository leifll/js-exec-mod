'use strict';

// Chapter 9 in the spec, https://tc39.es/ecma262/

// https://medium.com/@g.smellyshovel/the-ecmascript-executable-code-and-execution-contexts-chapter-explained-fa6e098e230f

// https://www.plectica.com/maps/C7Z4HYSNU

// An 'agent cluster' (9.8) is a collection of agents that can communicate
// using shared memory. It's an abstraction used in the spec, it doesn't have to be implemented
// in reality.
// Summary of 'agent cluster' from the web page above:
// 1. An Agent Cluster is an abstraction used in the specification in order to divide Agents
//    into “groups” in bounds of which they can share memory with other Agents of this “group”.
// 2. Agents that are not in the same Agent Cluster can communicate one with another too. 
//    The “message passing” pattern is used in this purpose.

// An 'agent' (9.7) is a collection of everything needed to execute code.
// More precisely, it collects  execution contexts, an execution context stack, a running execution
// context, an Agent Record, and an executing thread. Except for the executing thread, the
// constituents of an agent belong exclusively to that agent (9.7). 'Agent' is an abstraction
// used in the spec, it doesn't have to be implemented in reality.
// Summary of 'agent' from the web page above:
// 1. The Agent comprises a bunch of stuff, two of which — the Agent Record and the
//    Executing Thread — have been considered in this chapter yet.
// 2. The Agent is an abstraction used in order to tie together all the constituents
//    of the surrounding Agent.
// 3. Separate Agents may share the same Executing Thread if non of them is blocking.
//    At the same time one Agent can not belong to different Executing Threads.
// 4. We can implicitly create a new Agent using the Web Workers API.
// 5. Agents created via the Web Workers API may communicate with each other by the
//    means of shared memory, which means that they belong to the same Agent Cluster.

// An 'agent record' is a set of properties, used by the Agent in order to store some
// information about the itself, for example whether it can block the executing thread.It's
// an abstraction used in the spec, it doesn't have to be implemented in reality.
// See table 29 in the spec, https://tc39.es/ecma262/#table-agent-record.

// An 'implementation' (4.2) is an external source that defines
// things in the spec that are marked as host (in appendix D) or implementation-defined or
// implementation-approximated. An implementation is a concrete artefact, such as a
// particular web browser.

// An 'implementation-defined' (4.2) thing is something that's independent,
// of the spec, and defined by something outside the spec, for example by a host.

// A 'implementation-approximated' (4.2) thing is an implementation-defined
// thing for which the spec recommends an ideal behavior.

// A 'host' (4.2) is an external source that defines
// things in the spec that are marked as host (in appendix D), but does not define
// implementation-defined or implementation-approximated things. A host is a collection
// of all implementations (such as all web browsers), that interface with the spec in the
// same way via the host things in appendix D.

// A 'host-defined' (4.2) thing is an implementation-defined thing
// that's listed in appendix D.

// A 'host environment' (4.2) is a particular choice of definition for
// all host-defined things.

// A 'host hook' (4.2) is a host-defined 'abstract operation'.

// An 'abstract operation' is a parameterized and named algorithm.

// An 'algorithm' is a behavior defined in the spec. It can be for example the body of a
// function that's defined in the spec.

// A 'job' (9.5) is an abstract concept representing some real code
// that the job is about to execute. 'Job' is an abstraction used in the spec, it doesn't
// have to be implemented in reality.
// Summary of 'job' (not from the web page above, since the spec has been changed since
// that page was written):
// 1. The Job’s code is executed by a certain executing thread, in a particular agent.
// 2. Jobs are scheduled for execution by ECMAScript 'host environments' in a the agent that
//    owns the 'realm' specified when scheduling the job. Bullet 3 below explains how jobs
//    are scheduled.
// 3. The spec defines the 'host hooks' HostEnqueueGenericJob,
//    HostEnqueueFinalizationRegistryCleanupJob, HostEnqueuePromiseJob, and HostEnqueueTimeoutJob
//    to schedule jobs. Each host hook schedules the kind of job it's name indicates.
// 4. When a job has been scheduled, the agent must execute that job at some future point in time,
//    when there is no running execution context in the agent for which the job is scheduled and
//    that agent's execution context stack is empty.
// 5. When a callback function related to a Job, like a promise handler, is invoked, the invocation
//    pushes its own 'execution context' and 'realm'. That pushed execution context will eventually
//    be executed. Note that the job executes by pushing an execution context.

// An 'environment record' (9.1) represents the association of identifiers to specific variables
// and functions. Usually an Environment Record is associated with some specific structure
// such as a function declaration or a block statement.

// An 'execution context stack' (9.4) is a stack collecting 'execution context's. The 'running
// execution context' is always at the top of the stack.

// A 'running execution context' (9.4) is a the 'execution context' being executed. Evaluation of
// code by the 'running execution context' may be suspended. Once the 'running execution context'
// has been suspended a different 'execution context' may become the 'running execution context'. At
// some later time a suspended 'execution context' may again become the 'running execution
// context' and continue evaluating its code at the point where it had previously been suspended.
// This can be visualized as function calls, with one execution context per function, which is in
// fact also the case.

// An 'execution context' (9.4) is used to track the runtime evaluation of code, code is always
// executed in a specific 'execution context', which is tracking the code's state. It's used to
// ensure that an ECMAScript implementation can monitor the evaluation of the code. 'Execution
// context' is an abstraction used in the spec, it doesn't have to be implemented in reality.
// It is impossible for ECMAScript code to directly access or observe an execution context.
// A new execution context is created whenever control is transferred from the executable code
// associated with the currently running execution context to executable code that is not
// associated with that execution context. This happens for example when a 'job' is executed,
// or a function is called.
// An execution context consists of 'state components'. There can be any number of 'state
// components', but only the following are mandatory:
// 1. 'code evaluation state' contains enough information (or state) to perform, suspend,
//     and resume evaluation of the code associated with this execution context.
// 2. 'Function', also called 'active function object' is a reference to the function being
//     executed, if a function is being executed. This component is null if the current code isn't
//     in a function.
// 3. 'ScriptOrModule' contains information about the script or module from which the code
//     being executed originates, or null if the code doesn't originate from a script or module.
// 4. 'Realm' is the 'realm record' (explained below) from which the code accesses resources.

// A 'realm' (9.3) is 

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop

// https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick#what-is-the-event-loop

// https://stackoverflow.com/questions/17542740/is-it-accurate-to-say-javascript-is-a-single-thread-language
