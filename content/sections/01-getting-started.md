---
title: "Getting Started"
order: 1
---

## Getting Started

Welcome to your Codex. This is your personal resource hub — tips, prompts, and context files for your project workflow.

### How to add content

1. Create a new `.md` file in `/content/sections/`
2. Add frontmatter at the top with `title` and `order`
3. Write your content in standard Markdown
4. Push to GitHub — Vercel will auto-deploy

### Frontmatter reference

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Section label in the nav |
| `order` | Yes | Sort order (lower = higher up) |
| `type` | No | Set to `expandable` for large collapsible blocks |
| `downloadName` | No | Filename for the download button (expandable only) |

### Example file

```md
---
title: "My Section"
order: 2
---

Your content here.
```
