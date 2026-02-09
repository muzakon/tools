import { reactive } from 'vue'
import type { PaintState } from '~/types/paint'

let _state: PaintState | null = null

export function usePaintState(): PaintState {
  if (!_state) {
    _state = reactive<PaintState>({
      camera: { x: 0, y: 0, zoom: 1 },
      elements: [],
      activeTool: 'brush',
      brushColor: '#fafafa',
      brushWidth: 12,
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

export function resetPaintState(): void {
  if (!_state) return
  _state.camera = { x: 0, y: 0, zoom: 1 }
  _state.elements = []
  _state.activeTool = 'brush'
  _state.sessionId = null
  _state.sessionName = 'Untitled'
  _state.eraserTrail = []
  _state.shapesToDelete = new Set()
  _state.dirty = true
}
