import type { PaintState, ToolHandlers, Point, RectElement, Camera } from '~/types/paint'
import type { HistoryManager } from '../useHistory'
import { uid } from '../utils'

export function useRectTool(state: PaintState, history: HistoryManager): ToolHandlers {
  let start: Point | null = null
  let preview: RectElement | null = null

  return {
    name: 'rect',
    cursor: 'crosshair',
    onPointerDown(_e: PointerEvent, worldPos: Point) {
      start = { ...worldPos }
      preview = {
        type: 'rect',
        id: uid(),
        x: worldPos.x,
        y: worldPos.y,
        w: 0,
        h: 0,
        color: state.brushColor,
        lineWidth: state.brushWidth,
        filled: state.filled,
      }
    },
    onPointerMove(_e: PointerEvent, worldPos: Point) {
      if (!start || !preview) return
      preview.x = Math.min(start.x, worldPos.x)
      preview.y = Math.min(start.y, worldPos.y)
      preview.w = Math.abs(worldPos.x - start.x)
      preview.h = Math.abs(worldPos.y - start.y)
      state.dirty = true
    },
    onPointerUp() {
      if (!preview) return
      if (preview.w > 2 || preview.h > 2) {
        state.elements.push(preview)
        history.record({ type: 'add', items: [preview] })
      }
      preview = null
      start = null
      state.dirty = true
    },
    renderPreview(ctx: CanvasRenderingContext2D, cam: Camera) {
      if (!preview) return
      const z = cam.zoom
      const toX = (wx: number) => (wx - cam.x) * z + ctx.canvas.width / (2 * (window.devicePixelRatio || 1))
      const toY = (wy: number) => (wy - cam.y) * z + ctx.canvas.height / (2 * (window.devicePixelRatio || 1))
      const sx = toX(preview.x)
      const sy = toY(preview.y)
      const sw = preview.w * z
      const sh = preview.h * z
      ctx.strokeStyle = preview.color
      ctx.lineWidth = preview.lineWidth * z
      ctx.setLineDash([6, 4])
      if (preview.filled) {
        ctx.fillStyle = preview.color + '33'
        ctx.fillRect(sx, sy, sw, sh)
      }
      ctx.strokeRect(sx, sy, sw, sh)
      ctx.setLineDash([])
    },
  }
}
