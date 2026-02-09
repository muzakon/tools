export interface NavItem {
  title?: string
  description?: string
  to?: string
  icon?: string
  type?: 'subheader' | 'divider' | 'item'
}

export const navItems: NavItem[] = [
  { type: 'subheader', title: 'Notes' },
  { title: 'Paint', to: '/notes/paint', icon: 'mdi-brush', description: 'Infinite canvas drawing tool with shapes, brushes, and export' },
  { title: 'Markdown', to: '/notes/markdown', icon: 'mdi-language-markdown', description: 'Live markdown editor with syntax highlighting and Mermaid diagrams' },
  { type: 'divider' },
  { type: 'subheader', title: 'Converters' },
  { title: 'Cron', to: '/converters/cron', icon: 'mdi-clock-outline', description: 'Convert cron expressions to human-readable format' },
  { title: 'Timestamp', to: '/converters/timestamp', icon: 'mdi-timer', description: 'Convert between timestamps and dates across timezones' },
  { title: 'Base64', to: '/converters/base64', icon: 'mdi-code-braces', description: 'Encode and decode Base64 strings instantly' },
  { title: 'Color Converter', to: '/converters/color', icon: 'mdi-palette', description: 'Convert colors between HEX, RGB, HSL and generate palettes' },
  { type: 'divider' },
  { type: 'subheader', title: 'Graphics' },
  { title: 'Image Resizer', to: '/graphics/image-resizer', icon: 'mdi-resize', description: 'Resize images client-side with drag-and-drop support' },
  { title: 'Image Compressor', to: '/graphics/image-compressor', icon: 'mdi-image-off', description: 'Compress images in the browser with quality control' },
  { type: 'divider' },
  { type: 'subheader', title: 'Text Utilities' },
  { title: 'Regex Tester', to: '/text-utils/regex', icon: 'mdi-regex', description: 'Test regular expressions with real-time matching and capture groups' },
]

export function useNavigation() {
  const categories = computed(() => {
    const result: { title: string; items: NavItem[] }[] = []
    let current: { title: string; items: NavItem[] } | null = null

    for (const item of navItems) {
      if (item.type === 'subheader') {
        current = { title: item.title!, items: [] }
        result.push(current)
      } else if (!item.type && current) {
        current.items.push(item)
      }
    }

    return result
  })

  return { items: navItems, categories }
}
