import { marked } from 'marked'
import hljs from 'highlight.js'

export interface ExpandableItem {
  slug: string
  title: string
  order: number
  downloadName?: string
  contentHtml: string
}

export interface Section {
  slug: string
  title: string
  order: number
  type: 'section' | 'expandable' | 'group'
  downloadName?: string
  contentHtml: string
  children?: ExpandableItem[]
}

// Configure marked with highlight.js
marked.setOptions({
  // @ts-expect-error highlight option accepted at runtime
  highlight: (code: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
})

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const data: Record<string, string> = {}
  match[1].split('\n').forEach((line) => {
    const colon = line.indexOf(':')
    if (colon === -1) return
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    if (key) data[key] = val
  })

  return { data, content: match[2] }
}

const modules = import.meta.glob('../../content/sections/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export function getAllSections(): Section[] {
  const topLevel: Section[] = []
  const groups: Record<string, { index?: { title: string; order: number; contentHtml: string }; children: ExpandableItem[] }> = {}

  for (const [path, raw] of Object.entries(modules)) {
    const relative = path.replace('../../content/sections/', '')
    const parts = relative.split('/')

    if (parts.length === 1) {
      // Top-level file — existing behaviour
      const slug = parts[0].replace(/\.md$/, '')
      const { data, content } = parseFrontmatter(raw)
      topLevel.push({
        slug,
        title: data.title || slug,
        order: parseInt(data.order ?? '99', 10),
        type: data.type === 'expandable' ? 'expandable' : 'section',
        downloadName: data.downloadName,
        contentHtml: marked(content) as string,
      })
    } else {
      // Nested file inside a folder
      const folderName = parts[0]
      const filename = parts[1]
      if (!groups[folderName]) groups[folderName] = { children: [] }

      if (filename === '_index.md') {
        const { data, content } = parseFrontmatter(raw)
        groups[folderName].index = {
          title: data.title || folderName,
          order: parseInt(data.order ?? '99', 10),
          contentHtml: marked(content) as string,
        }
      } else {
        const slug = filename.replace(/\.md$/, '')
        const { data, content } = parseFrontmatter(raw)
        groups[folderName].children.push({
          slug: `${folderName}-${slug}`,
          title: data.title || slug,
          order: parseInt(data.order ?? '99', 10),
          downloadName: data.downloadName,
          contentHtml: marked(content) as string,
        })
      }
    }
  }

  // Convert groups to sections
  for (const [folderName, group] of Object.entries(groups)) {
    topLevel.push({
      slug: folderName,
      title: group.index?.title || folderName,
      order: group.index?.order ?? 99,
      type: 'group',
      contentHtml: group.index?.contentHtml || '',
      children: group.children.sort((a, b) => a.order - b.order),
    })
  }

  return topLevel.sort((a, b) => a.order - b.order)
}
