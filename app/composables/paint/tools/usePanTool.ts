import type { PaintState, ToolHandlers, Point } from '~/types/paint'

export function usePanTool(state: PaintState): ToolHandlers {
  let dragging = false
  let lastScreen: Point = { x: 0, y: 0 }

  return {
    name: 'pan',
    cursor: 'grab',
    onPointerDown(e: PointerEvent, _worldPos: Point) {
      dragging = true
      lastScreen = { x: e.clientX, y: e.clientY }
    },
    onPointerMove(e: PointerEvent, _worldPos: Point) {
      if (!dragging) return
      const dx = e.clientX - lastScreen.x
      const dy = e.clientY - lastScreen.y
      state.camera.x -= dx / state.camera.zoom
      state.camera.y -= dy / state.camera.zoom
      lastScreen = { x: e.clientX, y: e.clientY }
      state.dirty = true
    },
    onPointerUp() {
      dragging = false
    },
  }
}
