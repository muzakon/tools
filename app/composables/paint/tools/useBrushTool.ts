import type { PaintState, ToolHandlers, Point, BrushElement } from '~/types/paint'
import type { HistoryManager } from '../useHistory'
import { uid, simplifyPoints } from '../utils'

export function useBrushTool(state: PaintState, history: HistoryManager): ToolHandlers {
  let current: BrushElement | null = null

  return {
    name: 'brush',
    cursor: 'none',
    onPointerDown(_e: PointerEvent, worldPos: Point) {
      current = {
        type: 'brush',
        id: uid(),
        points: [{ ...worldPos }],
        color: state.brushColor,
        width: state.brushWidth,
      }
      state.elements.push(current)
      state.dirty = true
    },
    onPointerMove(_e: PointerEvent, worldPos: Point) {
      if (!current) return
      current.points.push({ ...worldPos })
      state.dirty = true
    },
    onPointerUp() {
      if (!current) return
      current.points = simplifyPoints(current.points, 1 / state.camera.zoom)
      history.record({ type: 'add', items: [current] })
      current = null
      state.dirty = true
    },
  }
}
