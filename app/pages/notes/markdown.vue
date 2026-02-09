<template>
  <div class="h-dvh overflow-hidden">
    <div class="grid h-full grid-rows-2 lg:grid-rows-1 lg:grid-cols-2">

      <!-- Markdown -->
      <div class="!p-3 lg:!p-4 flex flex-col min-h-0 overflow-hidden lg:!pr-2">
        <label class="text-xs !mb-2 font-medium text-neutral-500 mono shrink-0">
          Markdown
        </label>

        <div
          class="relative flex-1 min-h-0 bg-white/[4%] border border-white/10 overflow-hidden rounded-lg"
        >
          <textarea
            v-model="markdown"
            class="absolute inset-0 !p-3 lg:!p-4 text-xs mono outline-none !resize-none bg-transparent"
            spellcheck="false"
          />
        </div>
      </div>

      <!-- Preview -->
      <div class="!p-3 lg:!p-4 flex flex-col min-h-0 overflow-hidden lg:!pl-2">
        <label class="text-xs !mb-2 font-medium text-neutral-500 mono shrink-0">
          Preview
        </label>

        <div
          ref="previewRef"
          class="relative flex-1 min-h-0 bg-white/[4%] border border-white/10 overflow-y-auto rounded-lg markdown-body !p-4 lg:!p-6 text-sm"
          v-html="renderedHtml"
        />
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import mermaid from 'mermaid'

const markdown = ref('')
const previewRef = ref<HTMLElement | null>(null)

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
})

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      if (lang === 'mermaid') return code
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value
      }
      return hljs.highlightAuto(code).value
    },
  }),
  {
    gfm: true,
    breaks: false,
    renderer: {
      code({ text, lang }: { text: string; lang?: string }) {
        if (lang === 'mermaid') {
          return `<div class="mermaid">${text}</div>`
        }
        return false as unknown as string
      },
    },
  },
)

const renderedHtml = computed(() => {
  if (!markdown.value) return ''
  const raw = marked.parse(markdown.value) as string
  return DOMPurify.sanitize(raw)
})

watch(renderedHtml, async () => {
  await nextTick()
  if (!previewRef.value) return
  const els = previewRef.value.querySelectorAll('.mermaid')
  if (els.length === 0) return
  // Reset processed mermaid elements so they can be re-rendered
  els.forEach((el) => el.removeAttribute('data-processed'))
  try {
    await mermaid.run({ nodes: els as NodeListOf<HTMLElement> })
  } catch (e) {
    console.warn('Mermaid render failed:', e)
  }
})
</script>


<style scoped lang="scss">
:deep(.markdown-body) {
  color: #e5e7eb;
  line-height: 1.65;

  p {
    margin: 1em 0;
  }

  img {
    max-width: 100%;
    border-radius: 6px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
    line-height: 1.25;
    color: #f4f4f5;
    margin-top: 1.4em;
    margin-bottom: 0.6em;
  }

  h4, h5, h6 { font-weight: bold; }

  h1 { font-size: 2em; border-bottom: 1px solid #27272a; padding-bottom: 0.3em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid #27272a; padding-bottom: 0.3em; }
  h3 { font-size: 1.25em; }
  h4 { font-size: 1.1em; }
  h5 { font-size: 1em; }
  h6 { font-size: 0.9em; color: #d4d4d8; }

  h1:first-child, h2:first-child, h3:first-child {
    margin-top: 0;
  }

  a {
    color: #60a5fa;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  blockquote {
    color: #a1a1aa;
    margin: 1.2em 0;
    padding: 0.5em 1em;
    border-left: 3px solid #3f3f46;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0 6px 6px 0;

    p:first-child { margin-top: 0; }
    p:last-child { margin-bottom: 0; }
  }

  hr {
    display: block;
    height: 1px;
    border: 0;
    background: linear-gradient(
      to right,
      transparent,
      #3f3f46,
      transparent
    );
    margin: 2em 0;
  }

  pre,
  code,
  kbd,
  samp {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.9em;
  }

  code {
    padding: 0.15em 0.4em;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.08);
    color: #fbbf24;
  }

  pre {
    margin: 1.5em 0;
    padding: 1em 1.2em;
    border-radius: 8px;
    background: #0a0a0a;
    border: 1px solid #27272a;
    overflow-x: auto;

    code {
      background: transparent;
      padding: 0;
      color: inherit;
      font-size: 0.85em;
      line-height: 1.6;
    }
  }

  // highlight.js token colors (dark)
  .hljs {
    color: #e5e7eb;
  }
  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-literal,
  .hljs-section,
  .hljs-link { color: #c084fc; }

  .hljs-function .hljs-keyword { color: #c084fc; }

  .hljs-string,
  .hljs-title.function_,
  .hljs-title.class_ { color: #60a5fa; }

  .hljs-string,
  .hljs-attr { color: #34d399; }

  .hljs-number,
  .hljs-literal { color: #fb923c; }

  .hljs-comment,
  .hljs-quote { color: #6b7280; font-style: italic; }

  .hljs-meta,
  .hljs-meta .hljs-keyword { color: #f472b6; }

  .hljs-type,
  .hljs-built_in { color: #fbbf24; }

  .hljs-title { color: #60a5fa; }

  .hljs-params { color: #e5e7eb; }

  .hljs-variable,
  .hljs-template-variable { color: #f97316; }

  .hljs-regexp { color: #f87171; }

  .hljs-addition { color: #34d399; background: rgba(52, 211, 153, 0.1); }
  .hljs-deletion { color: #f87171; background: rgba(248, 113, 113, 0.1); }

  b,
  strong {
    font-weight: bold;
    color: #fafafa;
  }

  em {
    color: #d4d4d8;
  }

  del {
    color: #71717a;
    text-decoration: line-through;
  }

  dfn {
    font-style: italic;
    color: #c7d2fe;
  }

  ins {
    background: #14532d;
    color: #bbf7d0;
    text-decoration: none;
  }

  mark {
    background: #854d0e;
    color: #fde68a;
    font-style: italic;
    font-weight: bold;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sup { top: -0.5em; }
  sub { bottom: -0.25em; }

  ul,
  ol {
    margin: 1em 0;
    padding-left: 1.8em;
  }

  ul { list-style-type: disc; }
  ol { list-style-type: decimal; }

  li {
    margin: 0.25em 0;

    &::marker {
      color: #71717a;
    }
  }

  li p:last-child {
    margin: 0;
  }

  // task lists
  input[type="checkbox"] {
    margin-right: 0.4em;
    accent-color: #60a5fa;
  }

  dd {
    margin-left: 2em;
    color: #d4d4d8;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5em 0;
    font-size: 0.95em;
  }

  th {
    text-align: left;
    padding: 0.6em 0.8em;
    border-bottom: 2px solid #3f3f46;
    color: #fafafa;
    font-weight: 600;
  }

  td {
    padding: 0.6em 0.8em;
    border-bottom: 1px solid #27272a;
    vertical-align: top;
    color: #e5e7eb;
  }

  tr:hover td {
    background: rgba(255, 255, 255, 0.03);
  }

  // mermaid diagrams
  .mermaid {
    margin: 1.5em 0;
    display: flex;
    justify-content: center;

    svg {
      max-width: 100%;
      height: auto;
    }
  }

  // kbd
  kbd {
    display: inline-block;
    padding: 0.15em 0.4em;
    font-size: 0.85em;
    color: #e5e7eb;
    background: #27272a;
    border: 1px solid #3f3f46;
    border-radius: 4px;
    box-shadow: inset 0 -1px 0 #18181b;
  }
}
</style>
