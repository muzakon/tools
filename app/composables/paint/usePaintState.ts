import { reactive } from 'vue'
import type { PaintState } from '~/types/paint'

let _state: PaintState | null = null

export function usePaintState(): PaintState {
  if (!_state) {
    _state = reactive<PaintState>({
      camera: { x: 0, y: 0, zoom: 1 },
      elements: [],
      activeTool: 'brush',
      brushColor: '#e74c3c',
      brushWidth: 3,
      filled: false,
      theme: 'dark',
      dirty: true,
      pointerWorld: { x: 0, y: 0 },
      showCursor: false,
      sessionId: null,
      sessionName: 'Untitled',
      eraserTrail: [],
      shapesToDelete: new Set(),
    })
  }
  return _state
}
