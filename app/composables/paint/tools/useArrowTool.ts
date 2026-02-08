import type { PaintState, ToolHandlers, Point, ArrowElement, Camera } from '~/types/paint'
import type { HistoryManager } from '../useHistory'
import { uid } from '../utils'

export function useArrowTool(state: PaintState, history: HistoryManager): ToolHandlers {
  let start: Point | null = null
  let preview: ArrowElement | null = null

  return {
    name: 'arrow',
    cursor: 'crosshair',
    onPointerDown(_e: PointerEvent, worldPos: Point) {
      start = { ...worldPos }
      preview = {
        type: 'arrow',
        id: uid(),
        x1: worldPos.x,
        y1: worldPos.y,
        x2: worldPos.x,
        y2: worldPos.y,
        color: state.brushColor,
        lineWidth: state.brushWidth,
      }
    },
    onPointerMove(_e: PointerEvent, worldPos: Point) {
      if (!preview) return
      preview.x2 = worldPos.x
      preview.y2 = worldPos.y
      state.dirty = true
    },
    onPointerUp() {
      if (!preview || !start) return
      const dx = preview.x2 - preview.x1
      const dy = preview.y2 - preview.y1
      if (Math.hypot(dx, dy) > 5) {
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
      const hw = ctx.canvas.width / (2 * (window.devicePixelRatio || 1))
      const hh = ctx.canvas.height / (2 * (window.devicePixelRatio || 1))
      const sx1 = (preview.x1 - cam.x) * z + hw
      const sy1 = (preview.y1 - cam.y) * z + hh
      const sx2 = (preview.x2 - cam.x) * z + hw
      const sy2 = (preview.y2 - cam.y) * z + hh

      ctx.strokeStyle = preview.color
      ctx.lineWidth = preview.lineWidth * z
      ctx.setLineDash([6, 4])
      ctx.beginPath()
      ctx.moveTo(sx1, sy1)
      ctx.lineTo(sx2, sy2)
      ctx.stroke()

      // arrowhead
      const angle = Math.atan2(sy2 - sy1, sx2 - sx1)
      const headLen = 15 * z
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.moveTo(sx2, sy2)
      ctx.lineTo(sx2 - headLen * Math.cos(angle - 0.4), sy2 - headLen * Math.sin(angle - 0.4))
      ctx.moveTo(sx2, sy2)
      ctx.lineTo(sx2 - headLen * Math.cos(angle + 0.4), sy2 - headLen * Math.sin(angle + 0.4))
      ctx.stroke()
    },
  }
}
