import type { PaintState, ToolHandlers, Point } from '~/types/paint'
import type { HistoryManager } from '../useHistory'
import { elementBounds, pointInBounds, distToSegment } from '../utils'

export function useEraserTool(state: PaintState, history: HistoryManager): ToolHandlers {
  let dragging = false

  return {
    name: 'eraser',
    cursor: 'crosshair',
    onPointerDown(e: PointerEvent, worldPos: Point) {
      dragging = true
      state.shapesToDelete = new Set()
      state.eraserTrail = [{ x: e.offsetX, y: e.offsetY, time: Date.now() }]
      checkCollision(worldPos)
    },
    onPointerMove(e: PointerEvent, worldPos: Point) {
      if (!dragging) return
      state.eraserTrail.push({ x: e.offsetX, y: e.offsetY, time: Date.now() })
      checkCollision(worldPos)
      state.dirty = true
    },
    onPointerUp() {
      if (!dragging) return
      dragging = false

      // Commit deletion
      if (state.shapesToDelete.size > 0) {
        const deletedItems = state.elements.filter(el => state.shapesToDelete.has(el.id))
        state.elements = state.elements.filter(el => !state.shapesToDelete.has(el.id))
        history.record({ type: 'delete', items: deletedItems })
      }

      state.shapesToDelete = new Set()
      state.eraserTrail = []
      state.dirty = true
    },
  }

  function checkCollision(worldPos: Point) {
    const r = 20 / state.camera.zoom

    for (const el of state.elements) {
      if (state.shapesToDelete.has(el.id)) continue

      // Broad phase: bounding box
      const bounds = elementBounds(el)
      if (!pointInBounds(worldPos, bounds, r)) continue

      // Narrow phase: per-type hit test
      const hitThreshold = r + ((el.type === 'brush' ? el.width : el.type === 'arrow' ? el.lineWidth : el.type === 'rect' ? el.lineWidth : el.lineWidth) / 2)
      let hit = false

      switch (el.type) {
        case 'brush': {
          for (let i = 0; i < el.points.length - 1; i++) {
            if (distToSegment(worldPos, el.points[i]!, el.points[i + 1]!) < hitThreshold) {
              hit = true
              break
            }
          }
          break
        }
        case 'rect': {
          // Check 4 edges of the rectangle
          const x1 = el.x, y1 = el.y
          const x2 = el.x + el.w, y2 = el.y + el.h
          const p1 = { x: x1, y: y1 }, p2 = { x: x2, y: y1 }
          const p3 = { x: x2, y: y2 }, p4 = { x: x1, y: y2 }
          if (distToSegment(worldPos, p1, p2) < hitThreshold) hit = true
          else if (distToSegment(worldPos, p2, p3) < hitThreshold) hit = true
          else if (distToSegment(worldPos, p3, p4) < hitThreshold) hit = true
          else if (distToSegment(worldPos, p4, p1) < hitThreshold) hit = true
          break
        }
        case 'circle': {
          // Check collision against circumference
          const distToCenter = Math.hypot(worldPos.x - el.cx, worldPos.y - el.cy)
          const avgRadius = (el.rx + el.ry) / 2
          if (Math.abs(distToCenter - avgRadius) < hitThreshold) hit = true
          break
        }
        case 'arrow': {
          const start = { x: el.x1, y: el.y1 }
          const end = { x: el.x2, y: el.y2 }
          // Shaft
          if (distToSegment(worldPos, start, end) < hitThreshold) {
            hit = true
          } else {
            // Arrowhead wings
            const angle = Math.atan2(end.y - start.y, end.x - start.x)
            const headLen = 20
            const w1 = { x: end.x - headLen * Math.cos(angle - Math.PI / 6), y: end.y - headLen * Math.sin(angle - Math.PI / 6) }
            const w2 = { x: end.x - headLen * Math.cos(angle + Math.PI / 6), y: end.y - headLen * Math.sin(angle + Math.PI / 6) }
            if (distToSegment(worldPos, end, w1) < hitThreshold) hit = true
            else if (distToSegment(worldPos, end, w2) < hitThreshold) hit = true
          }
          break
        }
      }

      if (hit) {
        state.shapesToDelete.add(el.id)
      }
    }
  }
}
