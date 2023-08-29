'use strict';

// Chapter 9 in the spec, https://tc39.es/ecma262/

// https://medium.com/@g.smellyshovel/the-ecmascript-executable-code-and-execution-contexts-chapter-explained-fa6e098e230f

// https://www.plectica.com/maps/C7Z4HYSNU

// A noun with uppercase initial letter is defined in the specification.

// An Agent Cluster (9.8) is a collection of Agents that can communicate
// using shared memory. It's an abstraction used in the spec, it doesn't have to be implemented
// in reality.
// Summary of Agent Cluster from the web page above:
// 1. An Agent Cluster is an abstraction used in the specification in order to divide Agents
//    into “groups” in bounds of which they can share memory with other Agents of this “group”.
// 2. Agents that are not in the same Agent Cluster can communicate one with another too.
//    The “message passing” pattern is used in this purpose.

// An Agent (9.7) is a collection of everything needed to execute code.
// More precisely, it collects  Execution Contexts, an Execution Context stack, a Running Execution
// Context, an Agent Record, and an Executing Thread. Except for the Executing Thread, the
// constituents of an Agent belong exclusively to that Agent (9.7). Agent is an abstraction
// used in the spec, it doesn't have to be implemented in reality.
// Summary of Agent from the web page above:
// 1. The Agent comprises a bunch of stuff, like the Agent Record and the
//    Executing Thread.
// 2. The Agent is an abstraction used in order to tie together all the constituents
//    of the surrounding Agent.
// 3. Separate Agents may share the same Executing Thread if non of them is blocking.
//    At the same time one Agent can not belong to different Executing Threads.
// 4. We can implicitly create a new Agent using the Web Workers API.

// An Agent Record is a set of properties, used by the Agent in order to store some
// information about itself, for example whether it can block the executing thread.It's
// an abstraction used in the spec, it doesn't have to be implemented in reality.
// See table 29 in the spec, https://tc39.es/ecma262/#table-agent-record.

// An Implementation (4.2) is an external source that defines
// things in the spec that are marked as host (in appendix D) or Implementation-Defined or
// Implementation-Approximated. An Implementation is a concrete artefact, such as a
// particular web browser.

// An Implementation-Defined (4.2) thing is something that's independent,
// of the spec, and defined by something outside the spec, for example by a Host.

// A Implementation-Approximated (4.2) thing is an Implementation-Defined
// thing for which the spec recommends an ideal behavior.

// A Host (4.2) is an external source that defines
// things in the spec that are marked as Host (in appendix D), but does not define
// Implementation-Defined or Implementation-Approximated things. A Host is a collection
// of all implementations (such as all web browsers), that interface with the spec in the
// same way via the host things in appendix D.

// A Host-Defined (4.2) thing is an Implementation-Defined thing
// that's listed in appendix D.

// A Host Environment (4.2) is a particular choice of definition for
// all host-defined things.

// A Host Hook (4.2) is a Host-Defined Abstract Operation.

// An Abstract Operation is a parameterized and named Algorithm.

// An Algorithm is a behavior defined in the spec. It can be for example the body of a
// function that's defined in the spec.

// A Job (9.5) is an abstract concept representing some real code
// that the Job is about to execute. Job is an abstraction used in the spec, it doesn't
// have to be implemented in reality.
// Summary of Job (not from the web page above, since the spec has been changed since
// that page was written):
// 1. The Job’s code is executed by a certain Executing Thread, in a particular Agent.
// 2. Jobs are scheduled for execution by ECMAScript Host Environments in the Agent that
//    owns the Realm specified when scheduling the Job. Bullet 3 below explains how Jobs
//    are scheduled.
// 3. The spec defines the Host Hooks HostEnqueueGenericJob,
//    HostEnqueueFinalizationRegistryCleanupJob, HostEnqueuePromiseJob, and HostEnqueueTimeoutJob
//    to schedule Jobs. Each Host Hook schedules the kind of Job it's name indicates.
// 4. When a Job has been scheduled, the Agent must execute that Job at some future point in time,
//    when there is no Running Execution Context in the Agent for which the Job is scheduled and
//    that Agent's Execution Context stack is empty.
// 5. When a callback function related to a Job, like a promise handler, is invoked, the invocation
//    pushes its own Execution Context and Realm. That pushed Execution Context will eventually
//    be executed. Note that the Job executes by pushing an Execution Context.

// An Environment Record (9.1) represents the association of identifiers to specific variables
// and functions. Usually an Environment Record is associated with some specific structure
// such as a function declaration or a block statement. Every Environment Record has an
// [[OuterEnv]] field, which is either null or a reference to an outer Environment Record.
// Environment Records are purely specification mechanisms and need not correspond to any
// specific artefact of an ECMAScript implementation. It is impossible for an ECMAScript program
// to directly access or manipulate such values.

// An Execution Context Stack (9.4) is a stack collecting Execution Contexts. The Running
// Execution Context is always at the top of the stack.

// A Running Execution Context (9.4) is a the Execution Context being executed. Evaluation of
// code by the RRunning Execution Context may be suspended. Once the Running Execution Context
// has been suspended, a different Execution Context may become the Running Execution Context. At
// some later time a suspended Execution Context may again become the Running Execution
// Context and continue evaluating its code at the point where it had previously been suspended.
// This can be visualized as function calls, with one Execution Context per function, which is in
// fact also the case.

// An Execution Context (9.4) is used to track the runtime evaluation of code, code is always
// executed in a specific Execution Context, which is tracking the code's state. It's used to
// ensure that an ECMAScript implementation can monitor the evaluation of the code. Execution
// Context is an abstraction used in the spec, it doesn't have to be implemented in reality.
// It is impossible for ECMAScript code to directly access or observe an Execution Context.
// A new Execution Context is created whenever control is transferred from the executable code
// associated with the currently running Execution Context to executable code that is not
// associated with that Execution Context. This happens for example when a Job is executed,
// or a function is called.
// An execution context consists of State Components. There can be any number of State
// Components, but only the following are mandatory:
// 1. Code Evaluation State contains enough information (or state) to perform, suspend,
//    and resume evaluation of the code associated with this Execution Context.
// 2. Function, also called Active Function Object is a reference to the function being
//    executed, if a function is being executed. This component is null if the current code isn't
//    in a function.
// 3. ScriptOrModule contains information about the script or module from which the code
//    being executed originates, or null if the code doesn't originate from a script or module.
// 4. Realm is the Realm Record (explained below) from which the code accesses resources.
// 5. LexicalEnvironment identifies the Environment Record used to resolve identifier
//    references made by code within this Execution Context.
// 6. VariableEnvironment identifies the Environment Record that holds bindings created by
//    VariableStatements within this Execution Context.
// 7. PrivateEnvironment identifies the PrivateEnvironment Record that holds Private Names
//    created by ClassElements in the nearest containing class, or null if there is no containing
//    class.

// A Realm (9.3) consists of a set of intrinsic objects, an ECMAScript global environment,
// all of the ECMAScript code that is loaded within the scope of that global environment,
// and other associated state and resources. When an Execution Context is created, a new Realm
// is not created for it. Instead, an already existing Realm is associated with the newly created
// Execution context. This means that, since the same Realm is shared between different
// Execution Contexts, all Execution Contexts share the same global environment, and can see
// each other's updates of the global environment.

// A Realm Record is a collection of a Realm's content.
