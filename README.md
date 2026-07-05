# 🏆 KickIQ
### Your AI Copilot for Every World Cup Match

> Built for the **Injective Global Cup Hackathon 2026**

---

## 🎯 The Problem

World Cup fans juggle multiple apps for fixtures, standings, live scores, statistics, team comparisons, and AI analysis. KickIQ unifies everything into one intelligent assistant.

---

## 💡 The Solution

An AI-powered football assistant combining live World Cup data with Injective's newest technologies (x402, CCTP, MCP Server, Agent Skills) to deliver real-time predictions, analytics, and premium insights.

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui |
| **Backend** | Next.js API Routes, Node.js |
| **AI** | OpenAI API, Vercel AI SDK |
| **Injective** | x402, USDC CCTP, MCP Server, Agent Skills |
| **Football Data** | API-Football |
| **Database** | PostgreSQL, Prisma ORM |
| **Auth** | Clerk |
| **Deployment** | Vercel, Neon PostgreSQL |

---

## 🔌 Injective Integration (Core Requirement)

### x402 — Premium Access Control
- Protects premium AI endpoints (advanced predictions, tactical breakdowns, match simulations)
- Pay-per-request model for AI insights using USDC

### USDC CCTP — Cross-Chain Payments
- Premium subscription payments via cross-chain USDC
- Seamless user experience across chains

### MCP Server — Structured Data Access
- Exposes football data (fixtures, standings, stats, live scores) as MCP tools
- AI agents query structured World Cup data on-demand

### Agent Skills — Intelligent Football Agents
- **MatchPredictor**: Win probability, expected score, key players, confidence
- **TacticalAnalyst**: Formation analysis, pressing patterns, weaknesses
- **MatchSummarizer**: Post-match narratives, key moments, player ratings
- **FantasyAdvisor**: Captain picks, differential players, fixture planning

---

## 📦 Core Features (Hackathon Scope)

| Feature | Status | Injective Tech |
|---------|--------|----------------|
| Live Dashboard (fixtures, standings, live scores) | ✅ MVP | MCP Server |
| AI Chat Assistant | ✅ MVP | Agent Skills |
| Match Predictions (win %, xG, key players) | ✅ MVP | Agent Skills + x402 |
| Team Comparison (form, H2H, stats) | ✅ MVP | MCP Server |
| Premium AI Reports (tactical, simulations) | 🔒 Premium | x402 + CCTP |
| Wallet Connection & Payments | ✅ MVP | CCTP + x402 |

---

## 🎬 Demo Flow

1. **Landing** → View today's World Cup matches
2. **Dashboard** → Live scores, standings, upcoming fixtures
3. **AI Chat** → Ask: "Predict Spain vs Brazil"
4. **Free Tier** → Basic prediction with win probability
5. **Unlock Premium** → Connect wallet, pay via x402/CCTP
6. **Premium Insights** → Tactical breakdown, match simulation, confidence intervals

---

## 📁 Project Structure

```
kickiq/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (AI, football, payments)
│   ├── chat/              # AI chat page
│   ├── dashboard/         # Main dashboard
│   ├── match/[id]/        # Match detail page
│   ├── team/[id]/         # Team detail page
│   ├── predictions/       # Predictions page
│   └── premium/           # Premium features
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, configs
├── services/              # Business logic (football, AI, Injective)
├── prisma/                # Database schema
├── agents/                # Agent Skills implementations
├── types/                 # TypeScript types
└── public/                # Static assets
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Run database
npx prisma migrate dev

# Start development
npm run dev
```

**Required Environment Variables:**
```
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
OPENAI_API_KEY=
API_FOOTBALL_KEY=
INJECTIVE_RPC_URL=
```

---

## 🏗 Architecture

```
User → Next.js Frontend → API Routes
                              ├── Football Data (MCP Server) → API-Football
                              ├── AI Agents (Agent Skills) → OpenAI
                              └── Payments (x402 + CCTP) → Injective Chain
```

---

## 📋 Hackathon Checklist

- [x] Next.js 15 + TypeScript + Tailwind + shadcn/ui
- [x] Football API integration (fixtures, live, standings, teams)
- [x] MCP Server exposing football data as tools
- [x] Agent Skills: MatchPredictor, TacticalAnalyst, MatchSummarizer, FantasyAdvisor
- [x] AI Chat with Vercel AI SDK
- [x] x402 middleware protecting premium endpoints
- [x] CCTP payment flow for subscriptions
- [x] Wallet connection (Injective wallet)
- [x] Clean README with Injective integration details
- [ ] Deploy to Vercel
- [ ] Demo video
- [ ] X post with #InjectiveGlobalCupHackathon

---

## 🔗 Links

- **GitHub**: [Repository](https://github.com/yourusername/kickiq)
- **Demo**: [Live App](https://kickiq.vercel.app)
- **Demo Video**: [Link](#)

---

## 🏆 Tagline

> **KickIQ — Smarter Football. Better Insights.**