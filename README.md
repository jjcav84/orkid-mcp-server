# @orkid-labs/mcp-server

Orkid Swap MCP server for AI agents — gasless, MEV-protected token swaps, cross-chain bridge quotes, and **StateVector** market-data tools, over stdio.

This package is a thin stdio↔HTTP bridge to the hosted Orkid MCP endpoint (`https://orkidlabs.xyz/api/mcp`). All tools are passed through live — no local reimplementation.

## Tools (25)

- `orkid_quote` — live swap quote, best route across DEX + RFQ liquidity
- `orkid_bridge_quote` — cross-chain bridge quotes (Across) with unsigned tx data
- `orkid_swap_link` — prefilled swap URL for human review/sign
- `orkid_chains` — supported chains
- `sv_*` — 20 StateVector data tools: corridor heat (`sv_flow`), DLN order-eval book (`sv_intents`), UniswapX order-flow (`sv_uniswapx`), filings, macro, futures, factors, AML screening, and more

## Pricing

- **Free**: get a partner API key at <https://orkidlabs.xyz/partner> and set `ORKID_API_KEY`
- **Pay-per-call**: keyless calls return x402 `PaymentRequired` — agents pay USDC per call on Base via any x402-compatible client

## Usage

### Claude Desktop / stdio config

```json
{
  "mcpServers": {
    "orkid": {
      "command": "npx",
      "args": ["-y", "@orkid-labs/mcp-server"],
      "env": {
        "ORKID_API_KEY": "your-key-here"
      }
    }
  }
}
```

`ORKID_API_KEY` is optional — omit it for x402 pay-per-call mode.

### Environment

| Var | Default | Purpose |
|---|---|---|
| `ORKID_API_KEY` | — | Partner API key (free tier) |
| `ORKID_MCP_URL` | `https://orkidlabs.xyz/api/mcp` | Upstream endpoint override |

## Remote alternative

Most modern MCP clients can connect directly to the hosted endpoint — no package needed:

```
https://orkidlabs.xyz/api/mcp
```

Server card: `https://orkidlabs.xyz/.well-known/mcp/server-card.json`
Official registry: `xyz.orkidlabs/orkid-swap`

## Links

- API docs: <https://docs.orkidlabs.xyz>
- x402 pricing: <https://docs.orkidlabs.xyz/docs/x402>
- Repo: <https://github.com/jjcav84/orkid-mcp-server>
