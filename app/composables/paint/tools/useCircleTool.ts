import type { PaintState, ToolHandlers, Point, CircleElement, Camera } from '~/types/paint'
import type { HistoryManager } from '../useHistory'
import { uid } from '../utils'

export function useCircleTool(state: PaintState, history: HistoryManager): ToolHandlers {
  let start: Point | null = null
  let preview: CircleElement | null = null

  return {
    name: 'circle',
    cursor: 'crosshair',
    onPointerDown(_e: PointerEvent, worldPos: Point) {
      start = { ...worldPos }
      preview = {
        type: 'circle',
        id: uid(),
        cx: worldPos.x,
        cy: worldPos.y,
        rx: 0,
        ry: 0,
        color: state.brushColor,
        lineWidth: 4,
        filled: state.filled,
      }
    },
    onPointerMove(_e: PointerEvent, worldPos: Point) {
      if (!start || !preview) return
      preview.cx = (start.x + worldPos.x) / 2
      preview.cy = (start.y + worldPos.y) / 2
      preview.rx = Math.abs(worldPos.x - start.x) / 2
      preview.ry = Math.abs(worldPos.y - start.y) / 2
      state.dirty = true
    },
    onPointerUp() {
      if (!preview) return
      if (preview.rx > 2 || preview.ry > 2) {
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
      const w = ctx.canvas.width / (2 * (window.devicePixelRatio || 1))
      const h = ctx.canvas.height / (2 * (window.devicePixelRatio || 1))
      const sx = (preview.cx - cam.x) * z + w
      const sy = (preview.cy - cam.y) * z + h
      ctx.strokeStyle = preview.color
      ctx.lineWidth = preview.lineWidth * z
      ctx.setLineDash([6, 4])
      ctx.beginPath()
      ctx.ellipse(sx, sy, preview.rx * z, preview.ry * z, 0, 0, Math.PI * 2)
      if (preview.filled) {
        ctx.fillStyle = preview.color + '33'
        ctx.fill()
      }
      ctx.stroke()
      ctx.setLineDash([])
    },
  }
}
