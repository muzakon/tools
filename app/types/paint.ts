export interface Point {
  x: number
  y: number
}

export interface BoundingBox {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export interface Camera {
  x: number
  y: number
  zoom: number
}

// Draw elements — discriminated union on `type`

export interface BrushElement {
  type: 'brush'
  id: string
  points: Point[]
  color: string
  width: number
}

export interface RectElement {
  type: 'rect'
  id: string
  x: number
  y: number
  w: number
  h: number
  color: string
  lineWidth: number
  filled: boolean
}

export interface CircleElement {
  type: 'circle'
  id: string
  cx: number
  cy: number
  rx: number
  ry: number
  color: string
  lineWidth: number
  filled: boolean
}

export interface ArrowElement {
  type: 'arrow'
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  lineWidth: number
}

export type DrawElement = BrushElement | RectElement | CircleElement | ArrowElement

export type ToolName = 'pan' | 'brush' | 'eraser' | 'rect' | 'circle' | 'arrow'

export interface ToolHandlers {
  name: ToolName
  cursor: string
  onPointerDown(e: PointerEvent, worldPos: Point): void
  onPointerMove(e: PointerEvent, worldPos: Point): void
  onPointerUp(e: PointerEvent, worldPos: Point): void
  renderPreview?(ctx: CanvasRenderingContext2D, camera: Camera): void
}

export type ThemeName = 'dark' | 'light' | 'blueprint'

export interface ThemeColors {
  bg: string
  grid: string
  cursorRing: string
  text: string
  uiBg: string
  uiBorder: string
}

export const THEMES: Record<ThemeName, ThemeColors> = {
  dark: {
    bg: 'oklch(24.5% 0 0)',
    grid: 'rgba(255, 255, 255, 0.2)',
    cursorRing: 'rgba(255, 255, 255, 0.37)',
    text: '#e0e0e0',
    uiBg: 'oklch(22.5% 0 0)',
    uiBorder: 'rgba(255,255,255,0.08)',
  },
  light: {
    bg: '#f5f5f0',
    grid: 'rgba(0, 0, 0, 0.08)',
    cursorRing: 'rgba(0,0,0,0.5)',
    text: '#333',
    uiBg: 'rgba(255,255,255,0.92)',
    uiBorder: 'rgba(0,0,0,0.1)',
  },
  blueprint: {
    bg: '#1a3a5c',
    grid: 'rgba(200, 220, 255, 0.15)',
    cursorRing: 'rgba(200,220,255,0.6)',
    text: '#c8dcf0',
    uiBg: 'rgba(15,40,70,0.92)',
    uiBorder: 'rgba(100,160,220,0.15)',
  },
}

export interface EraserTrailPoint {
  x: number
  y: number
  time: number
}

export interface HistoryAction {
  type: 'add' | 'delete'
  items: DrawElement[]
}

export interface PaintSession {
  id: string
  name: string
  elements: DrawElement[]
  camera: Camera
  timestamp: number
}

export interface PaintState {
  camera: Camera
  elements: DrawElement[]
  activeTool: ToolName
  brushColor: string
  brushWidth: number
  filled: boolean
  theme: ThemeName
  dirty: boolean
  pointerWorld: Point
  showCursor: boolean
  sessionId: string | null
  sessionName: string
  // Eraser state — shared with renderer for visual feedback
  eraserTrail: EraserTrailPoint[]
  shapesToDelete: Set<string>
}
