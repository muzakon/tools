import { ref, onMounted, onUnmounted } from 'vue'
import type { PaintState, Point } from '~/types/paint'

export function useCanvas(state: PaintState) {
  const container = ref<HTMLDivElement | null>(null)
  const bgCanvas = ref<HTMLCanvasElement | null>(null)
  const drawCanvas = ref<HTMLCanvasElement | null>(null)
  const overlayCanvas = ref<HTMLCanvasElement | null>(null)

  let dpr = 1
  let ro: ResizeObserver | null = null

  function resize() {
    const el = container.value
    if (!el) return
    dpr = window.devicePixelRatio || 1
    const w = el.clientWidth
    const h = el.clientHeight
    for (const c of [bgCanvas.value, drawCanvas.value, overlayCanvas.value]) {
      if (!c) continue
      c.width = w * dpr
      c.height = h * dpr
      c.style.width = w + 'px'
      c.style.height = h + 'px'
    }
    state.dirty = true
  }

  function screenToWorld(sx: number, sy: number): Point {
    const el = container.value
    if (!el) return { x: sx, y: sy }
    const rect = el.getBoundingClientRect()
    const cx = sx - rect.left
    const cy = sy - rect.top
    return {
      x: (cx - el.clientWidth / 2) / state.camera.zoom + state.camera.x,
      y: (cy - el.clientHeight / 2) / state.camera.zoom + state.camera.y,
    }
  }

  function worldToScreen(wx: number, wy: number): Point {
    const el = container.value
    if (!el) return { x: wx, y: wy }
    return {
      x: (wx - state.camera.x) * state.camera.zoom + el.clientWidth / 2,
      y: (wy - state.camera.y) * state.camera.zoom + el.clientHeight / 2,
    }
  }

  function getDpr() {
    return dpr
  }

  function getSize() {
    const el = container.value
    if (!el) return { w: 0, h: 0 }
    return { w: el.clientWidth, h: el.clientHeight }
  }

  onMounted(() => {
    resize()
    ro = new ResizeObserver(resize)
    if (container.value) ro.observe(container.value)
  })

  onUnmounted(() => {
    ro?.disconnect()
  })

  return { container, bgCanvas, drawCanvas, overlayCanvas, screenToWorld, worldToScreen, getDpr, getSize, resize }
}
