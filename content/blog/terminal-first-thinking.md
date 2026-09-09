---
title: "Terminal-First Thinking: Why I Built YourCode"
date: "2026-06-15"
readTime: "5 min read"
tags: ["cli", "open-source", "dx"]
excerpt: "On building a terminal-based coding agent and why I believe the future of developer tools lives in the terminal, not the browser."
---

Every few years, there's a wave of developer tools that try to bring the coding experience into the browser. GitHub Codespaces, StackBlitz, CodeSandbox - they're all great. But there's something about the terminal that these tools can't replicate.

The terminal is the most honest interface a developer has. No animations, no loading spinners, no drag-and-drop abstractions. Just input, output, and the full power of the system underneath.

## Why terminal?

When I started building YourCode, I asked myself: what would a coding agent look like if the terminal was the primary interface? Not a plugin for VS Code. Not a web app. Just a terminal.

The answer turned out to be surprisingly clean:

- **Zero dependencies** - no Electron, no browser, no runtime. Just the terminal you already have.
- **Monorepo architecture** - CLI, server, database, and shared packages, each independently developable.
- **Persistent sessions** - pick up where you left off, even after closing the terminal.
- **Customizable themes** - because developers care about how their tools look, even in the terminal.

## The architecture

YourCode is structured as a decoupled monorepo with four packages:

1. `packages/cli` - terminal UI powered by OpenTUI and React 19, managing the loopback OAuth listener, keyboard layers, and local tool execution runtime
2. `packages/server` - Hono API gateway managing Clerk JWT authentication, Polar usage metering, system prompt compilation, and Vercel AI SDK multi-provider streaming
3. `packages/database` - Prisma ORM layer with PostgreSQL
4. `packages/shared` - isomorphic Zod validation schemas, model definitions, and tool contracts

### Client-Side Distributed Tool Execution

Most cloud coding assistants force you to upload your entire codebase to remote containers, introducing latency and compliance risks. YourCode decouples model orchestration from tool execution: the backend streams tool call specifications, but every file read, search (`grep`/`glob`), edit, and shell command (`bash`) runs locally on your machine within strict `process.cwd()` path confinement boundaries. Proprietary source code never leaves your workspace unprompted.

## Enterprise AI Governance & Privacy Roadmap

As agentic coding becomes standard, security and compliance are paramount. We're actively building enterprise governance directly into the CLI runtime:

- **Client-Side DLP & PII Redaction**: Scanning tokens for private keys, secrets, and personal information before LLM transmission using Shannon entropy and local NER pseudonymization.
- **Indirect Prompt Injection Defense**: Structured XML/Markdown boundary framing and schema AST validation to neutralize malicious instructions embedded in third-party source files.
- **Zero-Knowledge Conversation Encryption**: Client-side AES-256-GCM message encryption derived via Argon2id from user passphrases, ensuring even database breaches expose zero plaintext code discussions.
- **Process Sandboxing**: Containerized process jailing for arbitrary shell commands with interactive Human-In-The-Loop (HITL) approval gates.

## Open source

I decided to make YourCode open-source from day one. Not because I expect a huge community (yet), but because I believe developer tools should be transparent. You should be able to read the code, understand the decisions, and fork it if my choices don't match yours.

Check it out at [yourcode.space](https://yourcode.space) or on [GitHub](https://github.com/devvrat-hans/yourcode).
