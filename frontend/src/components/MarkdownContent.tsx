/**
 * Minimal, dependency-free renderer for the markdown subset Post.body
 * documents as supported (see backend/apps/blog/models.py): ## / ### / ####
 * headings, **bold**, *italic*, "- " bullet lists, and [text](url) links.
 * Not a general markdown parser — deliberately narrow so it never needs
 * dangerouslySetInnerHTML (every node is a real React element).
 */
import type { ReactNode } from "react";

const SAFE_HREF = /^(https?:\/\/|\/|mailto:|#)/i;

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const tokenRe = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      const href = match[2];
      if (SAFE_HREF.test(href)) {
        const external = /^https?:\/\//i.test(href);
        nodes.push(
          <a
            key={key++}
            href={href}
            className="text-forest underline hover:no-underline"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {match[1]}
          </a>,
        );
      } else {
        nodes.push(match[1]);
      }
    } else if (match[3] !== undefined) {
      nodes.push(<strong key={key++}>{match[3]}</strong>);
    } else if (match[4] !== undefined) {
      nodes.push(<em key={key++}>{match[4]}</em>);
    }
    lastIndex = tokenRe.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function MarkdownContent({ body }: { body: string }) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  const isHeading = (l: string) => /^(#{2,4})\s+(.*)$/.test(l);
  const isBullet = (l: string) => /^[-*]\s+/.test(l);

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    const heading = /^(#{2,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = parseInline(heading[2]);
      const cls =
        level === 2
          ? "mt-10 mb-4 font-display text-2xl text-ink"
          : level === 3
            ? "mt-8 mb-3 font-display text-xl text-ink"
            : "mt-6 mb-2 font-display text-lg text-ink";
      blocks.push(
        level === 2 ? (
          <h2 key={key++} className={cls}>{text}</h2>
        ) : level === 3 ? (
          <h3 key={key++} className={cls}>{text}</h3>
        ) : (
          <h4 key={key++} className={cls}>{text}</h4>
        ),
      );
      i++;
      continue;
    }

    if (isBullet(line)) {
      const items: string[] = [];
      while (i < lines.length && isBullet(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++} className="mb-5 list-disc pl-5 space-y-1.5">
          {items.map((item, idx) => (
            <li key={idx}>{parseInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() && !isHeading(lines[i]) && !isBullet(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={key++} className="mb-5 whitespace-pre-line">
        {parseInline(paraLines.join("\n"))}
      </p>,
    );
  }

  return <>{blocks}</>;
}
