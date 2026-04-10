interface Props {
  slug: string
  title: string
  downloadName?: string
  contentHtml: string
}

export default function ExpandableBlock({ slug, title, downloadName, contentHtml }: Props) {
  return (
    <details
      id={slug}
      className="group border border-gray-200 rounded-xl overflow-hidden scroll-mt-8"
    >
      <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors list-none select-none">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="text-gray-400 transition-transform group-open:rotate-90 shrink-0"
            aria-hidden="true"
          >
            ▶
          </span>
          <span className="font-medium text-sm text-gray-900 truncate">{title}</span>
        </div>
        {downloadName && (
          <a
            href={`/downloads/${downloadName}`}
            download
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-xs text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded-md border border-blue-200 hover:border-blue-400 transition-colors bg-white"
          >
            Download .md
          </a>
        )}
      </summary>
      <div
        className="prose prose-sm prose-gray max-w-none px-5 py-5 border-t border-gray-200"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </details>
  )
}
