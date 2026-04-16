# Alfred / OpenClaude

Alfred (OpenClaude) is a terminal-first AI coding agent CLI that unifies cloud and local model providers. It provides a single developer workflow for prompts, tools, agents, tasks, streaming output, and model-specific onboarding.

## What This Project Is

This repository contains the `alfred-openclaude` CLI implementation, including:

- a cross-provider command-line runtime
- provider onboarding and profile management
- tool calling for shell, file operations, search, and more
- optional VS Code extension support
- headless gRPC server support for automation and integration

The repo is not currently published as `alfred-openclaude` on npm, so install locally from this repository instead of using `npm install -g alfred-openclaude`.

## Features

- Unified CLI for cloud and local model backends
- Support for OpenAI-compatible APIs, Gemini, GitHub Models, Codex OAuth, Codex, Ollama, Atomic Chat, and more
- Guided provider onboarding and saved provider profiles
- Rich tool-driven workflows: bash, file editing, grep, glob, agents, tasks, and slash commands
- Streaming tokens and live tool progress
- Optional memory companion and agent routing
- Headless gRPC server for external integration
- VS Code extension support in `vscode-extension/openclaude-vscode`

## Recommended Local Setup

From the repository root:

```powershell
cd C:\Users\Admin\Desktop\alfred2\openclaude\alfred
bun install
bun run build
```

Then install locally for global CLI use:

```powershell
npm install -g .
```

If you prefer to run directly without a global install:

```powershell
bun run dev
```

## Running the CLI

Launch the tool:

```powershell
alfred
```

Compatibility aliases also work:

```powershell
openclaude
openclaw
```

## Provider Setup

Start provider onboarding from within the CLI:

```powershell
openclaude onboard
```

For GitHub Models onboarding:

```powershell
openclaude onboard-github
```

You can also run provider setup directly:

```powershell
/provider
```

### Fastest OpenAI Setup

```powershell
$env:CLAUDE_CODE_USE_OPENAI = "1"
$env:OPENAI_API_KEY = "sk-your-key-here"
$env:OPENAI_MODEL = "gpt-4o"
openclaude
```

### Fastest Local Ollama Setup

```powershell
$env:CLAUDE_CODE_USE_OPENAI = "1"
$env:OPENAI_BASE_URL = "http://localhost:11434/v1"
$env:OPENAI_MODEL = "qwen2.5-coder:7b"
openclaude
```

## Useful Commands

- `bun run build` — build the CLI
- `bun run dev` — build and run locally
- `bun test` — run tests
- `bun run smoke` — verify build and CLI startup
- `bun run test:coverage` — generate coverage

## Repository Structure

- `src/` — core CLI and runtime source
- `scripts/` — build, launch, and maintenance scripts
- `docs/` — setup and project documentation
- `python/` — Python helpers and tests
- `vscode-extension/openclaude-vscode/` — VS Code extension sources
- `bin/` — CLI launcher scripts

## Notes

This repository is built around Bun and Node.js. If you want to use the CLI globally on your machine, install it locally from this repo rather than trying to fetch a published npm package.

## Contributing

Contributions are welcome. Before opening a large change, consider opening an issue to discuss scope. Useful validation commands:

```powershell
bun run build
bun run smoke
bun test
bun run test:coverage
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
