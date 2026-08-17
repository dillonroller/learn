# Mission: AI Engineering

## Why
The user is actively working inside real agentic AI systems (this very course-generation workflow is one) and wants to go from being a user of these systems to being a credible builder of them — designing, building, and debugging agent systems from first principles rather than picking up fragments from blog posts. Direct, concrete grounding is available throughout: the environment the user is learning in is itself a live example of most of what this course teaches.

## Success looks like
- Design a tool-use loop from scratch (system prompt, tool schemas, the read-act-observe cycle) and explain the specific failure modes of naive versions
- Explain context/memory management strategies (context windows, summarization, retrieval) and articulate when each applies
- Design or trace a multi-agent orchestration pattern (e.g. planner/worker, subagent delegation) and explain its tradeoffs against a single agent
- Given a broken agent system, reason systematically about whether the failure is in the prompt, the tool definitions, the memory/context handling, or the underlying model — and justify the diagnosis

## Constraints
- Strong CS/systems background (Rust/C, comfortable with real code and architecture diagrams, not just prose)
- Self-study with an AI teacher; can lean on the user's own working environment as a live, ongoing example
- Systems-level focus — this is about the scaffolding around a model, not about the model itself

## Out of scope
- Prompt-engineering-only content ("10 tips for better prompts") — this is systems and architecture, a level up from wording individual prompts
- Model training or fine-tuning itself — that belongs to a different course if ever picked up (frontier ML)
- Vendor-specific internals not actually knowable/verifiable — architectural patterns are taught generically and honestly, not as reverse-engineered claims about any one product
