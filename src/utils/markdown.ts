import { marked } from 'marked';
import { Source } from '../types.ts';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderMarkdown(markdownText: string, sources: Source[] = []): string {
  if (!markdownText) return '';

  // Remove the "### Related Questions" section from the main answer text body
  // because we render related questions separately as interactive clickable buttons
  const cleanedMarkdown = markdownText.replace(/### Related Questions[\s\S]*$/i, '').trim();

  // Convert markdown to HTML using marked
  let html = marked.parse(cleanedMarkdown) as string;

  // Enhance citations: match numbers like [1], [2], [1, 2] or [^1]
  html = html.replace(/\[\^?(\d+)\]/g, (_match, numStr) => {
    const index = parseInt(numStr, 10) - 1;
    const source = sources[index];
    if (source) {
      return `<a href="${source.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-1.5 py-0.2 mx-0.5 text-xs font-semibold rounded bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all hover:scale-105" title="${source.title} (${source.domain})">#${numStr}</a>`;
    }
    return `<span class="inline-flex items-center justify-center px-1.5 py-0.2 mx-0.5 text-xs font-semibold rounded bg-zinc-800 text-zinc-400 border border-zinc-700">#${numStr}</span>`;
  });

  return html;
}

export function extractDomainFavicon(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}
