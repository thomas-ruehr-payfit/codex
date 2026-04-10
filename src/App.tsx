import { useEffect, useRef } from 'react'
import { getAllSections } from './lib/content'
import SideNav from './components/SideNav'
import ExpandableBlock from './components/ExpandableBlock'

const sections = getAllSections()

function useCopyButtons() {
  const injected = useRef(false)

  useEffect(() => {
    if (injected.current) return
    injected.current = true

    document.querySelectorAll<HTMLPreElement>('pre').forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return

      const btn = document.createElement('button')
      btn.textContent = 'Copy'
      btn.className = 'copy-btn'
      btn.setAttribute('aria-label', 'Copy code to clipboard')

      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.innerText ?? pre.innerText
        try {
          await navigator.clipboard.writeText(code)
          btn.textContent = 'Copied!'
          btn.classList.add('copied')
          setTimeout(() => {
            btn.textContent = 'Copy'
            btn.classList.remove('copied')
          }, 2000)
        } catch {
          btn.textContent = 'Failed'
          setTimeout(() => { btn.textContent = 'Copy' }, 2000)
        }
      })

      pre.appendChild(btn)
    })
  }, [])
}

export default function App() {
  useCopyButtons()

  const navSections = sections.map((s) => ({ slug: s.slug, title: s.title }))

  return (
    <div className="flex min-h-screen bg-white text-gray-900 antialiased">
      {/* Sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-12 p-6">
          <SideNav sections={navSections} />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 px-6 lg:px-12 py-12 max-w-3xl">
        <header className="mb-12">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Codex</h1>
          <p className="mt-1 text-sm text-gray-500">Resources, prompts, and context files.</p>
        </header>

        <div className="space-y-16">
          {sections.map((section) =>
            section.type === 'expandable' ? (
              <ExpandableBlock
                key={section.slug}
                slug={section.slug}
                title={section.title}
                downloadName={section.downloadName}
                contentHtml={section.contentHtml}
              />
            ) : (
              <section key={section.slug} id={section.slug} className="scroll-mt-8">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.contentHtml }}
                />
              </section>
            )
          )}
        </div>
      </main>
    </div>
  )
}
