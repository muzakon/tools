import type { PaintState, ToolHandlers, ToolName, Point } from '~/types/paint'

export interface ToolManager {
  registerTool(handler: ToolHandlers): void
  setTool(name: ToolName): void
  getActiveTool(): ToolHandlers | null
  handlePointerDown(e: PointerEvent, worldPos: Point): void
  handlePointerMove(e: PointerEvent, worldPos: Point): void
  handlePointerUp(e: PointerEvent, worldPos: Point): void
  handleWheel(e: WheelEvent): void
}

export function useToolManager(
  state: PaintState,
  screenToWorld: (sx: number, sy: number) => Point
): ToolManager {
  const tools = new Map<ToolName, ToolHandlers>()

  function registerTool(handler: ToolHandlers) {
    tools.set(handler.name, handler)
  }

  function setTool(name: ToolName) {
    state.activeTool = name
    state.dirty = true
  }

  function getActiveTool(): ToolHandlers | null {
    return tools.get(state.activeTool) ?? null
  }

  function handlePointerDown(e: PointerEvent, worldPos: Point) {
    const tool = getActiveTool()
    tool?.onPointerDown(e, worldPos)
  }

  function handlePointerMove(e: PointerEvent, worldPos: Point) {
    state.pointerWorld = worldPos
    state.showCursor = true
    const tool = getActiveTool()
    tool?.onPointerMove(e, worldPos)
    state.dirty = true
  }

  function handlePointerUp(e: PointerEvent, worldPos: Point) {
    const tool = getActiveTool()
    tool?.onPointerUp(e, worldPos)
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault()
    const zoomFactor = 1.1
    const oldZoom = state.camera.zoom
    const newZoom = e.deltaY < 0
      ? oldZoom * zoomFactor
      : oldZoom / zoomFactor
    const clampedZoom = Math.max(0.5, Math.min(10, newZoom))

    // zoom towards cursor
    const world = screenToWorld(e.clientX, e.clientY)
    state.camera.zoom = clampedZoom
    // adjust camera so world point stays under cursor
    const el = (e.target as HTMLElement).parentElement
    if (el) {
      const rect = el.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      state.camera.x = world.x - (cx - el.clientWidth / 2) / clampedZoom
      state.camera.y = world.y - (cy - el.clientHeight / 2) / clampedZoom
    }
    state.dirty = true
  }

  return { registerTool, setTool, getActiveTool, handlePointerDown, handlePointerMove, handlePointerUp, handleWheel }
}
