```
docs/
├── product/
│   ├── PRD.md                  ← gộp user stories + error map vào đây
│   └── USER_STORIES.md         ← chỉ giữ nếu backlog dài
│
├── technical/
│   ├── ARCHITECTURE.md         ← gộp state map + tech stack + dependency list vào đây
│   ├── DATA_SCHEMA.md          ← giữ riêng (thay đổi thường xuyên)
│   ├── API_CONTRACT.md         ← giữ riêng (reference khi code)
│   ├── AUTH_FLOW.md            ← giữ riêng (security-critical)
│   └── NAMING_CONVENTIONS.md  ← giữ (Copilot cần cái này)
│
├── ai/
│   ├── AGENT_BRIEFING.md       ← file duy nhất paste đầu session
│   └── DECISIONS.md            ← log quyết định
│
├── design/
│   ├── ui-screenshots/          ← ảnh Figma hoặc màn hình
│   └── UI_BEHAVIOR_NOTES.md     ← ghi chú hành vi từng màn hình
│
└── ops/
    └── SETUP.md                ← gộp ENV_VARIABLES vào đây

```
Kèm theo trong mỗi feature:

```
features/
├── timer/
│   └── README-AI.md
├── auth/
│   └── README-AI.md
└── cycles/
    └── README-AI.md
```

---

Và 2 file gốc ở root:

```
/
├── AGENT_BRIEFING.md   ← symlink hoặc copy từ docs/ai/
└── .env.example
```