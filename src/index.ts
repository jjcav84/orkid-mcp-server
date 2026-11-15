#!/usr/bin/env node
/**
 * @orkid-labs/mcp-server — stdio MCP server proxying the hosted Orkid endpoint.
 *
 * Upstream: https://orkidlabs.xyz/api/mcp (streamable-http, session-managed by
 * the SDK client transport). Tools are passed through verbatim — discovery
 * (tools/list) works keyless; tool calls return x402 PaymentRequired payloads
 * unless ORKID_API_KEY is set (free partner key: https://orkidlabs.xyz/partner).
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  CallToolResultSchema,
  ListToolsRequestSchema,
  ListToolsResultSchema,
  PingRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

const UPSTREAM_URL = process.env.ORKID_MCP_URL ?? 'https://orkidlabs.xyz/api/mcp'
const API_KEY = process.env.ORKID_API_KEY

async function main() {
  const client = new Client(
    { name: 'orkid-mcp-stdio-bridge', version: '1.0.0' },
    { capabilities: {} },
  )

  const transport = new StreamableHTTPClientTransport(new URL(UPSTREAM_URL), {
    requestInit: API_KEY
      ? { headers: { 'X-ORKID-API-Key': API_KEY } }
      : undefined,
  })
  await client.connect(transport)

  const server = new Server(
    { name: 'orkid-swap', version: '1.0.0' },
    { capabilities: { tools: {} } },
  )

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return client.request(
      { method: 'tools/list', params: {} },
      ListToolsResultSchema,
    )
  })

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    return client.request(
      { method: 'tools/call', params: req.params },
      CallToolResultSchema,
    )
  })

  server.setRequestHandler(PingRequestSchema, async () => ({}))

  await server.connect(new StdioServerTransport())
}

main().catch((err) => {
  console.error('[orkid-mcp] fatal:', err)
  process.exit(1)
})
