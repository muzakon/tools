import type { Point, DrawElement, BoundingBox } from '~/types/paint'

export function distToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return Math.hypot(p.x - a.x, p.y - a.y)
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy))
}

export function simplifyPoints(points: Point[], tolerance: number): Point[] {
  if (points.length <= 2) return points
  let maxDist = 0
  let maxIdx = 0
  const first = points[0]!
  const last = points[points.length - 1]!
  for (let i = 1; i < points.length - 1; i++) {
    const d = distToSegment(points[i]!, first, last)
    if (d > maxDist) {
      maxDist = d
      maxIdx = i
    }
  }
  if (maxDist > tolerance) {
    const left = simplifyPoints(points.slice(0, maxIdx + 1), tolerance)
    const right = simplifyPoints(points.slice(maxIdx), tolerance)
    return left.slice(0, -1).concat(right)
  }
  return [first, last]
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function elementBounds(el: DrawElement): BoundingBox {
  switch (el.type) {
    case 'brush': {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      for (const p of el.points) {
        if (p.x < minX) minX = p.x
        if (p.y < minY) minY = p.y
        if (p.x > maxX) maxX = p.x
        if (p.y > maxY) maxY = p.y
      }
      const pad = el.width / 2
      return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad }
    }
    case 'rect':
      return { minX: el.x, minY: el.y, maxX: el.x + el.w, maxY: el.y + el.h }
    case 'circle':
      return { minX: el.cx - el.rx, minY: el.cy - el.ry, maxX: el.cx + el.rx, maxY: el.cy + el.ry }
    case 'arrow': {
      const pad = el.lineWidth
      return {
        minX: Math.min(el.x1, el.x2) - pad,
        minY: Math.min(el.y1, el.y2) - pad,
        maxX: Math.max(el.x1, el.x2) + pad,
        maxY: Math.max(el.y1, el.y2) + pad,
      }
    }
  }
}

export function boundsOverlap(a: BoundingBox, b: BoundingBox): boolean {
  return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY
}

export function pointInBounds(p: Point, b: BoundingBox, margin = 0): boolean {
  return p.x >= b.minX - margin && p.x <= b.maxX + margin && p.y >= b.minY - margin && p.y <= b.maxY + margin
}
