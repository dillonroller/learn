# Lessons 2–11 built on request, ahead of demonstrated need

The user asked to fill in the locked placeholder cards across the hub, so lessons 2–11 of CS Interview Prep now exist. This is a coverage event, not a learning event: the lessons were written (each by one agent, then independently reviewed for accuracy, citations and quiz correctness) but not yet worked through, so nothing here records demonstrated understanding.

**What each lesson is for** (the single tangible win it was designed around):

- [[../lessons/0002-arrays-and-hashmaps.html|Lesson 2]] — Take a 'find a pair / duplicate / group' problem written as O(n²) nested loops, rewrite it in Rust as one O(n) pass over a HashSet or HashMap, and state the space-for-time trade-off out loud.
- [[../lessons/0003-two-pointers-sliding-window.html|Lesson 3]] — Given a sorted-pair, subarray or substring problem, choose within a minute between converging pointers, a variable sliding window, or prefix sums plus a hash map, then write the O(n) Rust loop with a correct shrink condition.
- [[../lessons/0004-stacks-and-queues.html|Lesson 4]] — Solve 'next greater element / daily temperatures' with a monotonic stack in O(n), and 'k largest' with a size-k BinaryHeap<Reverse<_>> in O(n log k). Know which std collection gives LIFO, FIFO or priority order.
- [[../lessons/0005-binary-trees-and-bsts.html|Lesson 5]] — Write any 'compute something over a binary tree' function in Rust (max depth, invert, validate BST, kth smallest) with the base-case + combine-children template, and state its O(n) time / O(h) space.
- [[../lessons/0006-graph-traversal-bfs-dfs.html|Lesson 6]] — Turn an edge list or a 2D grid into a traversable graph in Rust, then solve 'count islands', 'fewest steps through a maze' and 'can all courses be finished?' with DFS, BFS and Kahn's algorithm in O(V + E).
- [[../lessons/0007-binary-search.html|Lesson 7]] — Rewrite any 'find the first / last / minimum x such that…' question as a monotone predicate and binary search it with a correct, terminating loop, including searching an answer range rather than an array.
- [[../lessons/0008-recursion-and-backtracking.html|Lesson 8]] — Generate subsets, permutations and combination sums with one choose/explore/unchoose Rust template, add pruning, and state the output-sized complexity (2ⁿ, n!, C(n,k)) before writing code.
- [[../lessons/0009-dynamic-programming.html|Lesson 9]] — Take a 'count the ways / min cost / is it possible' problem, define the dp state, recurrence and base cases, and implement it in Rust both top-down (memo) and bottom-up (table, then a rolling array).
- [[../lessons/0010-sorting-algorithms.html|Lesson 10]] — Justify which sort or selection tool fits a given constraint (sort, sort_unstable, select_nth_unstable, counting sort, or a heap), and implement merge and partition from scratch if the interviewer asks.
- [[../lessons/0011-system-design-fundamentals.html|Lesson 11]] — Walk a URL-shortener-style prompt through requirements → estimates → API → high-level design → deep dives, using back-of-envelope numbers and naming the right building block for each bottleneck.

**What to watch for next time.** Treat these as unverified until the user engages with them. The first follow-up question, or a quiz they report getting wrong, is the real signal for the zone of proximal development; until then, don't assume the material in these lessons is known when planning further work.
