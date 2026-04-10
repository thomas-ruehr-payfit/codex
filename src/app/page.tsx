import { getAllSections } from "@/lib/content";
import SideNav from "@/components/SideNav";
import ExpandableBlock from "@/components/ExpandableBlock";
import CopyCodeButtons from "@/components/CopyCodeButtons";

export default async function Home() {
  const sections = await getAllSections();
  const navSections = sections.map((s) => ({ slug: s.slug, title: s.title }));

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — hidden on small screens */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-12 p-6">
          <SideNav sections={navSections} />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 px-6 lg:px-12 py-12 max-w-3xl">
        <CopyCodeButtons />
        <header className="mb-12">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Codex
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Resources, prompts, and context files.
          </p>
        </header>

        <div className="space-y-16">
          {sections.map((section) =>
            section.type === "expandable" ? (
              <section key={section.slug} className="space-y-3">
                <ExpandableBlock
                  slug={section.slug}
                  title={section.title}
                  downloadName={section.downloadName}
                  contentHtml={section.contentHtml}
                />
              </section>
            ) : (
              <section
                key={section.slug}
                id={section.slug}
                className="scroll-mt-8"
              >
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
  );
}
