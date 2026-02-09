# MCP Integration (Claude)

This repo includes a local MCP server for Claude:

- Server script: `mcp/homebase-server.mjs`
- Start command: `npm run mcp:homebase`
- Default data file: `data.json` in repo root
- Override data path: set `HOMEBASE_DATA_PATH=/path/to/data.json`

## What the server exposes

### Tools
- `homebase_get_tasks`
- `homebase_create_task`
- `homebase_update_task`
- `homebase_delete_task`
- `homebase_get_meeting_workspace`

### Resources
- `homebase://summary`
- `homebase://tasks`
- `homebase://meeting-notes`

## Claude Desktop config (macOS)

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "homebase": {
      "command": "npm",
      "args": ["run", "mcp:homebase", "--silent"],
      "cwd": "/Users/muhammadhabib/Desktop/lifeg"
    }
  }
}
```

Restart Claude Desktop after saving config.

## Notes

- This MCP server reads/writes `data.json` directly.
- It respects deleted task tombstones so deleted tasks are not resurrected.
- Keep this server local; it is intended for trusted local usage.
