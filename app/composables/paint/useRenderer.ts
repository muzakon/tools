import { onMounted, onUnmounted } from 'vue'
import type { PaintState, DrawElement, Camera, ThemeColors, ToolHandlers } from '~/types/paint'
import { THEMES } from '~/types/paint'

const TRAIL_LIFETIME = 500

interface CanvasRefs {
  bgCanvas: { value: HTMLCanvasElement | null }
  drawCanvas: { value: HTMLCanvasElement | null }
  overlayCanvas: { value: HTMLCanvasElement | null }
  getDpr: () => number
  getSize: () => { w: number; h: number }
}

export function useRenderer(state: PaintState, canvas: CanvasRefs, getActiveToolHandlers: () => ToolHandlers | null) {
  let rafId = 0

  function colors(): ThemeColors {
    return THEMES[state.theme]
  }

  function renderBackground() {
    const ctx = canvas.bgCanvas.value?.getContext('2d')
    if (!ctx) return
    const dpr = canvas.getDpr()
    const { w, h } = canvas.getSize()
    const theme = colors()

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = theme.bg
    ctx.fillRect(0, 0, w, h)
  }

  function drawElement(ctx: CanvasRenderingContext2D, el: DrawElement, cam: Camera, w: number, h: number) {
    const z = cam.zoom
    const toX = (wx: number) => (wx - cam.x) * z + w / 2
    const toY = (wy: number) => (wy - cam.y) * z + h / 2

    // Eraser: fade shapes marked for deletion
    if (state.shapesToDelete.has(el.id)) {
      ctx.globalAlpha = 0.2
    } else {
      ctx.globalAlpha = 1.0
    }

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    switch (el.type) {
      case 'brush': {
        if (el.points.length < 2) return
        ctx.strokeStyle = el.color
        ctx.lineWidth = el.width * z
        ctx.beginPath()
        ctx.moveTo(toX(el.points[0]!.x), toY(el.points[0]!.y))
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(toX(el.points[i]!.x), toY(el.points[i]!.y))
        }
        ctx.stroke()
        break
      }
      case 'rect': {
        const sx = toX(el.x)
        const sy = toY(el.y)
        const sw = el.w * z
        const sh = el.h * z
        ctx.strokeStyle = el.color
        ctx.lineWidth = el.lineWidth * z
        if (el.filled) {
          ctx.fillStyle = el.color + '33'
          ctx.fillRect(sx, sy, sw, sh)
        }
        ctx.strokeRect(sx, sy, sw, sh)
        break
      }
      case 'circle': {
        const sx = toX(el.cx)
        const sy = toY(el.cy)
        ctx.strokeStyle = el.color
        ctx.lineWidth = el.lineWidth * z
        ctx.beginPath()
        ctx.ellipse(sx, sy, el.rx * z, el.ry * z, 0, 0, Math.PI * 2)
        if (el.filled) {
          ctx.fillStyle = el.color + '33'
          ctx.fill()
        }
        ctx.stroke()
        break
      }
      case 'arrow': {
        const sx1 = toX(el.x1)
        const sy1 = toY(el.y1)
        const sx2 = toX(el.x2)
        const sy2 = toY(el.y2)
        ctx.strokeStyle = el.color
        ctx.lineWidth = el.lineWidth * z
        ctx.beginPath()
        ctx.moveTo(sx1, sy1)
        ctx.lineTo(sx2, sy2)
        ctx.stroke()
        // arrowhead
        const angle = Math.atan2(sy2 - sy1, sx2 - sx1)
        const headLen = 15 * z
        ctx.beginPath()
        ctx.moveTo(sx2, sy2)
        ctx.lineTo(sx2 - headLen * Math.cos(angle - 0.4), sy2 - headLen * Math.sin(angle - 0.4))
        ctx.moveTo(sx2, sy2)
        ctx.lineTo(sx2 - headLen * Math.cos(angle + 0.4), sy2 - headLen * Math.sin(angle + 0.4))
        ctx.stroke()
        break
      }
    }

    ctx.globalAlpha = 1.0
  }

  function renderElements() {
    const ctx = canvas.drawCanvas.value?.getContext('2d')
    if (!ctx) return
    const dpr = canvas.getDpr()
    const { w, h } = canvas.getSize()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    for (const el of state.elements) {
      drawElement(ctx, el, state.camera, w, h)
    }

    // render active tool preview
    const tool = getActiveToolHandlers()
    if (tool?.renderPreview) {
      tool.renderPreview(ctx, state.camera)
    }
  }

  function renderOverlay() {
    const ctx = canvas.overlayCanvas.value?.getContext('2d')
    if (!ctx) return
    const dpr = canvas.getDpr()
    const { w, h } = canvas.getSize()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    // Eraser trail — fading red line (screen coords)
    if (state.activeTool === 'eraser' && state.eraserTrail.length > 0) {
      const now = Date.now()
      // Prune old points
      state.eraserTrail = state.eraserTrail.filter(p => now - p.time < TRAIL_LIFETIME)

      if (state.eraserTrail.length > 1) {
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        for (let i = 0; i < state.eraserTrail.length - 1; i++) {
          const p = state.eraserTrail[i]!
          const pNext = state.eraserTrail[i + 1]!
          const age = now - p.time
          const alpha = 1 - age / TRAIL_LIFETIME
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(pNext.x, pNext.y)
          ctx.strokeStyle = `rgba(255, 85, 85, ${Math.max(0, alpha)})`
          ctx.lineWidth = Math.max(0.1, alpha * 15)
          ctx.stroke()
        }
      }
    }

    if (!state.showCursor) return

    const theme = colors()
    const sx = (state.pointerWorld.x - state.camera.x) * state.camera.zoom + w / 2
    const sy = (state.pointerWorld.y - state.camera.y) * state.camera.zoom + h / 2

    if (state.activeTool === 'brush') {
      const r = (state.brushWidth / 2) * state.camera.zoom
      ctx.strokeStyle = theme.cursorRing
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(sx, sy, Math.max(r, 4), 0, Math.PI * 2)
      ctx.stroke()
      // crosshair
      ctx.beginPath()
      ctx.moveTo(sx - 4, sy)
      ctx.lineTo(sx + 4, sy)
      ctx.moveTo(sx, sy - 4)
      ctx.lineTo(sx, sy + 4)
      ctx.stroke()
    }

    if (['rect', 'circle', 'arrow'].includes(state.activeTool)) {
      const r = Math.max(2, (state.brushWidth * state.camera.zoom) / 2)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(sx, sy, r, 0, Math.PI * 2)
      ctx.stroke()
      // center dot
      ctx.beginPath()
      ctx.arc(sx, sy, 1, 0, Math.PI * 2)
      ctx.fillStyle = state.brushColor
      ctx.fill()
    }
  }

  function loop() {
    // Overlay always renders (eraser trail needs continuous animation)
    renderOverlay()

    if (state.dirty) {
      renderBackground()
      renderElements()
      state.dirty = false
    }
    rafId = requestAnimationFrame(loop)
  }

  onMounted(() => {
    rafId = requestAnimationFrame(loop)
  })

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
  })

  return { renderBackground, renderElements, renderOverlay }
}
