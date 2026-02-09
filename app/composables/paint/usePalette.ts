import { ref } from 'vue'

export const DEFAULT_PALETTE = [
  '#fafafa', // White
  '#a3a3a3', // Gray
  '#171717', // Black
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Yellow
  '#10b981', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#a855f7', // Purple
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#78350f', // Brown
]

const palette = ref([...DEFAULT_PALETTE])

export function usePalette() {
  return {
    palette,
  }
}
