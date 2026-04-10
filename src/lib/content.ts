import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export interface Section {
  slug: string;
  title: string;
  order: number;
  type: "section" | "expandable";
  downloadName?: string;
  contentHtml: string;
}

const sectionsDir = path.join(process.cwd(), "content", "sections");

export async function getAllSections(): Promise<Section[]> {
  const files = fs
    .readdirSync(sectionsDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const sections = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(sectionsDir, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const processed = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(content);

      return {
        slug,
        title: (data.title as string) || slug,
        order: (data.order as number) ?? 99,
        type: ((data.type as string) === "expandable"
          ? "expandable"
          : "section") as Section["type"],
        downloadName: data.downloadName as string | undefined,
        contentHtml: processed.toString(),
      };
    })
  );

  return sections.sort((a, b) => a.order - b.order);
}
