import { marked } from 'marked'
import hljs from 'highlight.js'

export interface Section {
  slug: string
  title: string
  order: number
  type: 'section' | 'expandable'
  downloadName?: string
  contentHtml: string
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

const modules = import.meta.glob('../../content/sections/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export function getAllSections(): Section[] {
  const sections: Section[] = Object.entries(modules).map(([path, raw]) => {
    const filename = path.split('/').pop()!
    const slug = filename.replace(/\.md$/, '')
    const { data, content } = parseFrontmatter(raw)

    return {
      slug,
      title: data.title || slug,
      order: parseInt(data.order ?? '99', 10),
      type: data.type === 'expandable' ? 'expandable' : 'section',
      downloadName: data.downloadName,
      contentHtml: marked(content) as string,
    }
  })

  return sections.sort((a, b) => a.order - b.order)
}
