# What's in this zip

```
smart-study-planner/
├── docs/
│   └── architecture.md          ← your full architecture doc, renamed/relocated
└── .agent/
    └── rules/
        └── architecture.md      ← the short "pointer" rule text
```

## How to use it

1. Unzip this into (or over) your existing `smart-study-planner` project folder in Antigravity.
   - `docs/architecture.md` is just your original doc, copied to the path the rule refers to.
2. For the **rule** itself, the `.agent/rules/architecture.md` file is included as a starting
   point, but Antigravity's exact rule storage path can vary by version — the reliable way to
   register it is still through the UI:
   - Agent panel → `•••` → Customizations → Rules → **+ Workspace**
   - Paste in the same text that's in `.agent/rules/architecture.md`
   - Save
   If Antigravity's Workspace rule creator writes to a different folder than `.agent/rules/`,
   that's fine — you can delete the one from this zip once you've created it properly through
   the UI, or just leave it; an unused stray file won't cause problems.
3. Once both are in place, test with a small prompt like:
   *"What does the project's architecture rule say?"*
   to confirm the agent is reading `docs/architecture.md`.
