---
title: "Code Review"
order: 2
downloadName: code-review.md
---

# Code Review Prompt

Use when asking Claude to review a specific file or component.

---

Review `[file path]` and flag:

1. **Security issues** — XSS, injection, exposed secrets
2. **Logic errors** — edge cases, off-by-one, null handling
3. **Readability** — naming, unnecessary complexity
4. **Performance** — obvious bottlenecks only

Be concise. Don't suggest refactors I didn't ask for.
