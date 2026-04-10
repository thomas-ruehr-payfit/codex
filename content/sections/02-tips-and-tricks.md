---
title: "Tips & Tricks"
order: 2
---

## Tips & Tricks

### Use specific file paths in prompts

Always reference exact file paths when asking Claude to edit something. Vague requests lead to invented solutions.

```
Edit the component at src/components/Button.tsx — 
change the hover color from gray-200 to gray-100.
```

### Keep a change log in plain language

Before starting a session, paste a 2–3 line summary of what changed last time. This re-establishes context fast.

### Scope your requests

One task per message. If you batch requests, Claude may silently skip the harder ones.

### Check before trusting

Claude will confidently invent file paths, function names, and APIs that don't exist. Always verify critical claims against the actual codebase.
