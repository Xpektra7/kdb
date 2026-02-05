import React from 'react';

/**
 * Parses simple markdown syntax and returns React elements
 * Supports: **bold**, *italic*, `code`
 */
export function parseMarkdown(text: string): React.ReactNode {
  if (!text) return text;

  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  // Pattern to match **bold**, *italic*, or `code`
  const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Check which pattern matched
    if (match[2]) {
      // **bold**
      parts.push(<strong key={key++} className="font-semibold text-foreground">{match[2]}</strong>);
    } else if (match[3]) {
      // *italic*
      parts.push(<em key={key++}>{match[3]}</em>);
    } else if (match[4]) {
      // `code`
      parts.push(<code key={key++} className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">{match[4]}</code>);
    }

    lastIndex = pattern.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

/**
 * Component wrapper for markdown text
 */
export function MarkdownText({ children, className }: { children: string; className?: string }) {
  return <span className={className}>{parseMarkdown(children)}</span>;
}
