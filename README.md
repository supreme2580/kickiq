# 🏆 KickIQ

### Your AI Copilot for the World Cup

> Built for the **Injective Global Cup Hackathon 2026**

---

## What It Does

KickIQ is an AI football assistant that answers any question about the 2026 FIFA World Cup — live scores, fixtures, standings, team stats, match predictions, tactical analysis, and betting insights. Users chat with the AI in natural language, and it fetches real data via tools before responding.

**Problem:** World Cup fans jump between 5+ apps for fixtures, standings, live scores, stats, and analysis. KickIQ replaces all of them with one intelligent chat interface.

**How users interact:** Open the app, type a question ("Who will win Argentina vs Brazil?", "Show today's fixtures", "Compare Messi vs Mbappe"), and the AI calls live data tools and returns a formatted answer with stats, tables, and prediction cards.

---

## Injective Integration

KickIQ uses four Injective technologies:

### x402 — Pay-per-Request Premium Access

Deep Analysis mode (tactical breakdowns, betting recommendations, detailed scouting reports) is gated behind x402 micropayments. When a user asks a deep question:

1. The backend returns a 402 with x402 payment requirements
2. The frontend signs the x402 payment via the user's Injective wallet (MetaMask with Injective EVM)
3. The backend verifies the payment signature and processes the AI analysis
4. Each deep query costs **0.10 USDC**

x402 is implemented as a middleware layer in the chat API route (`src/app/api/chat/route.ts`) using the `@injectivelabs/x402` library. The backend verifies the payment signature against the configured recipient address.

### USDC CCTP V2 — Cross-Chain USDC Bridging

Users can bridge USDC from Ethereum Sepolia to Injective Testnet directly within the app. The bridge flow:

1. User connects MetaMask (Sepolia) and selects a credit bundle
2. The app calls `depositForBurn` on Circle's TokenMessengerV2 contract to burn USDC on Sepolia
3. The app polls Circle's Iris API (V2 messages endpoint) for the attestation using the transaction hash
4. Once attested, the app calls `receiveMessage` on the Injective MessageTransmitter to mint USDC on Injective
5. Credits are credited to the user's account

Key implementation details:
- **`src/components/credits/buy-dialog.tsx`** — Full bridge UI with step tracking (approve → burn → attest → mint → purchase)
- **`src/app/api/bridge/attest/route.ts`** — Proxy to Circle Iris API (supports both V1 messageHash and V2 transaction hash lookups)
- **`src/models/CreditAccount.ts`** — MongoDB model tracking user credit balances
- Uses Circle's CCTP V2 contracts on Sepolia testnet (TokenMessenger, MessageTransmitter)

### MCP Server — Structured Football Data Tools

Football data is exposed as MCP (Model Context Protocol) tools that the AI agent can call:

| Tool | Description |
|------|-------------|
| `get_fixtures` | Match schedule, results, statuses by date/status |
| `get_live_scores` | Ongoing match scores |
| `get_standings` | World Cup group tables |
| `get_team_info` / `searchTeams` | Team lookup and search |
| `get_match_prediction` | AI-generated match predictions |
| `web_search` | Current news, odds, player info |
| `fetch_url` | Read full content from a URL |

The MCP tools are defined in `src/services/mcp/tools.ts` and registered in an agent loop that iterates up to 5 rounds, calling tools as needed until it has enough data to answer.

### Agent Skills — Intelligent AI Agents

The AI uses multiple agent skills depending on the question:

- **MatchPredictor** — Win probability, expected score, key players, confidence level
- **TacticalAnalyst** — Formation breakdown, pressing patterns, strategic weaknesses
- **MatchSummarizer** — Post-match narratives, key moments, player ratings
- **FantasyAdvisor** — Captain picks, differential players, fixture planning

Each skill is implemented as a system prompt + tool-calling loop. The simple mode uses concise chat, while Deep Analysis mode uses an expanded tactical analyst persona with structured output sections.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| **Backend** | Next.js API Routes |
| **AI** | OpenAI-compatible SDK, Ollama cloud API (`gemma4:31b`) |
| **Injective** | x402 (`@injectivelabs/x402`), USDC CCTP V2 (Circle), MCP Server, Agent Skills |
| **Football Data** | API-Football |
| **Database** | MongoDB (Mongoose) |
| **Auth** | Clerk |
| **Wallet** | MetaMask (Injective EVM + Sepolia), RainbowKit, wagmi, viem |

---

## Architecture

```
User → Next.js Chat UI
         ↓
    API Route (/api/chat)
         ↓
    Agent Loop (up to 5 rounds)
         ↓
    ┌── get_fixtures ────→ API-Football
    │── get_live_scores ──→ API-Football
    │── get_standings ────→ API-Football
    │── get_team_info ────→ API-Football
    │── get_prediction ───→ AI Model
    │── web_search ───────→ Tavily / Fallback
    └── fetch_url ────────→ Target URL
         ↓
    AI Response → Formatted markdown + Cards

Premium Deep Mode:
    User → 402 Payment Request
         ↓
    x402 Signed → Verified → Agent Loop → Response

USDC CCTP Bridge:
    User → depositForBurn (Sepolia)
         ↓
    Wait for Circle Attestation (Iris API V2)
         ↓
    receiveMessage (Injective Testnet)
         ↓
    Credits added to MongoDB
```

---

## Quick Start

```bash
# Install
npm install

# Copy env
cp .env.example .env

# Fill in your keys (see .env.example for all required vars)
# At minimum: OLLAMA_API_KEY, NEXT_PUBLIC_PREMIUM_RECIPIENT_ADDRESS, X402_PRIVATE_KEY

# Run
npm run dev
```

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `OLLAMA_API_KEY` | Ollama cloud API key (or any OpenAI-compatible key) |
| `LLM_MODEL` | Model name (default: `gemma4:31b`) |
| `NEXT_PUBLIC_PREMIUM_RECIPIENT_ADDRESS` | Injective address that receives USDC payments |
| `X402_PRIVATE_KEY` | Private key of a wallet funded with INJ for x402 settlement |
| `INJECTIVE_RPC_URL` | Injective EVM RPC endpoint |
| `MONGODB_URI` | MongoDB connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── bridge/attest   # Circle Iris API proxy (CCTP attestation)
│   │   ├── chat/           # AI chat + x402 payment + agent loop
│   │   ├── credits/        # Credit balance management
│   │   └── ...
│   ├── page.tsx            # Main chat interface
│   └── ...
├── components/
│   ├── cards/              # Fixture, prediction, standings cards
│   ├── credits/            # Buy dialog with CCTP bridge flow
│   └── ...
├── services/
│   ├── ai/                 # OpenAI client, agent loop
│   ├── football/           # API-Football data source
│   ├── mcp/                # MCP tool definitions and server
│   └── search/             # Web search (Tavily)
├── lib/
│   ├── x402-client.ts      # x402 payment signing
│   ├── x402-backend.ts     # x402 payment verification
│   ├── constants.ts        # Injective RPC, app config
│   └── wagmi.ts            # Wagmi config (Injective + Sepolia)
└── models/
    ├── CreditAccount.ts    # Credit balance model
    └── ...
```

---

## License

MIT
