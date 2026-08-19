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

YourCode is structured as a monorepo with four packages:

1. `cli` - the developer-facing interface
2. `server` - backend services and AI integration
3. `database` - persistence layer
4. `shared` - common types and utilities

This separation means I can swap out the AI provider, change the storage backend, or redesign the CLI without breaking anything else. Clean boundaries matter.

## Open source

I decided to make YourCode open-source from day one. Not because I expect a huge community (yet), but because I believe developer tools should be transparent. You should be able to read the code, understand the decisions, and fork it if my choices don't match yours.

Check it out at [yourcode.space](https://yourcode.space) or on [GitHub](https://github.com/devvrat-hans/yourcode).
