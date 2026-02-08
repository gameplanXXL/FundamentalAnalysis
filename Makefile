.PHONY: start dev build test install-mcp

build:
	npx tsc

start: build
	node dist/mcp-server.js

dev:
	npx tsx watch src/mcp-server.ts

test: build
	node dist/mcp-server.js &
	@echo "MCP Server started in background. Use Ctrl+C or kill to stop."

install-mcp:
	@echo '{"mcpServers":{"eodhd":{"command":"node","args":["dist/mcp-server.js"],"cwd":"'$(CURDIR)'","env":{"EODHD_API_TOKEN":"$${EODHD_API_TOKEN}"}}}}' > .mcp.json
	@echo ".mcp.json created successfully"
