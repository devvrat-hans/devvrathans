---
title: "Building ToonifyIt - A Token-Efficient Data Format for LLMs"
date: "2026-07-10"
readTime: "6 min read"
tags: ["llm", "web-dev", "project"]
excerpt: "How I built a developer tool that converts JSON to TOON format, saving tokens in LLM workflows. The architecture, decisions, and what I learned."
---

JSON is everywhere. It's the default data exchange format for APIs, configuration, and - increasingly - for feeding structured data into LLMs. But JSON is also verbose. Every key repeated, every bracket and quote adding tokens that don't carry meaning.

That's the problem ToonifyIt solves.

## What is TOON?

TOON stands for Token-Oriented Object Notation. It's a compact representation of structured data designed to minimize token usage while preserving readability. Think of it as JSON stripped down to its essentials - the data without the ceremony.

## The build

I built the conversion engine entirely client-side. No server, no API calls - everything happens in the browser. This was a deliberate choice: privacy matters when you're converting data that might contain API keys, user data, or proprietary information.

Key technical decisions:

- **Real-time conversion** - as you type, the output updates. Debounced just enough to stay smooth.
- **Configurable delimiters** - users can customize how TOON represents their data.
- **Token counting** - the tool shows you exactly how many tokens you save. That's the whole point.
- **Copy/download workflows** - one-click export for use in prompts or pipelines.

## What I learned

Building a developer tool taught me that the UX bar is different from a marketing website. Developers don't want animations or surprises - they want speed, clarity, and keyboard shortcuts. Every interaction should be predictable.

The tool went live at toonifyit.com and has been getting steady traffic since. Not bad for a weekend project.
