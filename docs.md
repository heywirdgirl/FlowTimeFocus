


```
/
└── docs/
    │
    ├── index.md                 ← documentation router / entrypoint
    │
    ├── design/                  ← Human-first (founder/product thinking)
    │   ├── product-vision.md
    │   ├── ux-flows.md
    │   ├── monetization.md
    │   ├── feature-ideas.md
    │   ├── interaction-notes.md
    │   └── constraints.md       ← product constraints / UX philosophy
    │
    ├── architecture/            ← Translation layer (design → engineering)
    │   ├── overview.md
    │   ├── state-flow.md
    │   ├── event-flow.md
    │   ├── storage.md
    │   ├── auth-flow.md
    │   └── infra.md
    │
    ├── technical/               ← Executable engineering references
    │   ├── DATA_SCHEMA.md
    │   ├── API_CONTRACT.md
    │   ├── ERROR_CODES.md
    │   ├── NAMING_CONVENTIONS.md
    │   └── ENV_VARIABLES.md     ← optional if env becomes large
    │
    ├── agents/                  ← AI-first, ultra condensed context
    │   ├── AGENT_BRIEFING.md
    │   ├── QUICK_CONTEXT.md
    │   ├── HARD_RULES.md
    │   ├── REFACTOR_RULES.md
    │   └── FILE_MAP.md
    │
    ├── decisions/               ← Long-term architectural memory
    │   ├── 2026-05-architecture.md
    │   ├── 2026-05-auth-strategy.md
    │   └── 2026-05-storage-choice.md
    │
    ├── ops/                     ← Operational knowledge
    │   ├── setup.md
    │   ├── deployment.md
    │   ├── monitoring.md
    │   ├── queues.md
    │   └── ci-cd.md
    │
    └── assets/                  ← Visual references
        ├── ui-screenshots/
        ├── diagrams/
        └── flows/
```
Kèm theo trong mỗi feature:

```
features/
├── timer/
│   └── context.md
├── auth/
│   └── context.md
└── cycles/
    └── context.md
```

---

Và 2 file gốc ở root:

```
/
├── AGENT_BRIEFING.md   ← symlink hoặc copy từ docs/ai/
└── .env.example
```
