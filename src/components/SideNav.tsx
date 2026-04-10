"use client";

import { useEffect, useState } from "react";

interface NavSection {
  slug: string;
  title: string;
}

export default function SideNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-10% 0% -80% 0%" }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="flex flex-col gap-0.5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
        Contents
      </p>
      {sections.map((s) => (
        <a
          key={s.slug}
          href={`#${s.slug}`}
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            active === s.slug
              ? "text-gray-900 bg-gray-100 font-medium"
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          {s.title}
        </a>
      ))}
    </nav>
  );
}
