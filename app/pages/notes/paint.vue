<template>
  <div class="paint-root">
    <!-- Canvas stack -->
    <div ref="container" class="canvas-container" @wheel.prevent="onWheel">
      <canvas ref="bgCanvas" class="layer" />
      <canvas ref="drawCanvas" class="layer" />
      <canvas
        ref="overlayCanvas"
        class="layer interactive"
        :style="{ cursor: activeCursor }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointerleave="onPointerLeave"
      />
    </div>

    <!-- Toolbar (left) -->
    <div class="panel toolbar" :style="panelStyle">
      <button
        v-for="t in toolButtons"
        :key="t.name"
        class="tool-btn"
        :class="{ active: state.activeTool === t.name }"
        :title="`${t.label} (${t.key})`"
        @click="toolManager.setTool(t.name)"
      >
        <span class="tool-icon">{{ t.icon }}</span>
      </button>
    </div>

    <!-- Brush settings (top-right) -->
    <div class="panel settings" :style="panelStyle">
      <label>
        <span class="label-text">Color</span>
        <input v-model="state.brushColor" type="color" class="color-input" />
      </label>
      <label>
        <span class="label-text">Size: {{ state.brushWidth }}</span>
        <input v-model.number="state.brushWidth" type="range" min="1" max="50" class="range-input" />
      </label>
      <label v-if="showFilled">
        <span class="label-text">Filled</span>
        <input v-model="state.filled" type="checkbox" />
      </label>
    </div>

    <!-- Theme settings (bottom-right) -->
    <div class="panel bg-settings" :style="panelStyle">
      <div class="panel-row">
        <span class="label-text">Theme</span>
        <select v-model="state.theme" class="select-input" @change="state.dirty = true">
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>

    <!-- Session panel (bottom-left) -->
    <div class="panel session-panel" :style="panelStyle">
      <div class="panel-row">
        <input
          v-model="state.sessionName"
          type="text"
          class="text-input"
          placeholder="Session name"
        />
        <button class="sm-btn" title="Save (Ctrl+S)" @click="saveSession">💾</button>
      </div>
      <div v-if="sessions.length" class="session-list">
        <div v-for="s in sessions" :key="s.id" class="session-item">
          <button class="session-name" @click="navigateToSession(s.id)">{{ s.name }}</button>
          <button class="sm-btn del" @click="deleteSession(s.id)">×</button>
        </div>
      </div>
    </div>

    <!-- Zoom indicator -->
    <div class="zoom-indicator" :style="panelStyle">
      {{ Math.round(state.camera.zoom * 100) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { PaintSession, ToolName } from '~/types/paint'
import { THEMES } from '~/types/paint'
import { usePaintState, resetPaintState } from '~/composables/paint/usePaintState'
import { useCanvas } from '~/composables/paint/useCanvas'
import { useHistory } from '~/composables/paint/useHistory'
import { useToolManager } from '~/composables/paint/useToolManager'
import { useRenderer } from '~/composables/paint/useRenderer'
import { useSession } from '~/composables/paint/useSession'
import { useKeyboard } from '~/composables/paint/useKeyboard'
import { usePanTool } from '~/composables/paint/tools/usePanTool'
import { useBrushTool } from '~/composables/paint/tools/useBrushTool'
import { useEraserTool } from '~/composables/paint/tools/useEraserTool'
import { useRectTool } from '~/composables/paint/tools/useRectTool'
import { useCircleTool } from '~/composables/paint/tools/useCircleTool'
import { useArrowTool } from '~/composables/paint/tools/useArrowTool'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()

const state = usePaintState()
const { container, bgCanvas, drawCanvas, overlayCanvas, screenToWorld, getDpr, getSize } = useCanvas(state)
const history = useHistory(state)
const toolManager = useToolManager(state, screenToWorld)
const session = useSession(state)

// Register tools
toolManager.registerTool(usePanTool(state))
toolManager.registerTool(useBrushTool(state, history))
toolManager.registerTool(useEraserTool(state, history))
toolManager.registerTool(useRectTool(state, history))
toolManager.registerTool(useCircleTool(state, history))
toolManager.registerTool(useArrowTool(state, history))

// Renderer needs tool reference for preview
useRenderer(state, { bgCanvas, drawCanvas, overlayCanvas, getDpr, getSize }, () => toolManager.getActiveTool())

// Keyboard (save is handled here via onSave callback)
useKeyboard(state, history, toolManager, { save: saveSession })

// Sessions
const sessions = ref<PaintSession[]>([])

function querySessionId(): string | null {
  const q = route.query.session
  return typeof q === 'string' ? q : null
}

async function refreshSessions() {
  sessions.value = (await session.list()).sort((a, b) => b.timestamp - a.timestamp)
}

async function saveSession() {
  const id = await session.save()
  await refreshSessions()
  // Put session id in query without triggering remount
  if (!querySessionId()) {
    router.replace({ query: { session: id } })
  }
}

async function navigateToSession(id: string) {
  await session.load(id)
  router.replace({ query: { session: id } })
}

async function deleteSession(id: string) {
  await session.remove(id)
  await refreshSessions()
  if (state.sessionId === id) {
    resetPaintState()
    router.replace({ query: {} })
  }
}

// When query.session is removed (e.g. clicking nav link to /notes/paint), reset state
watch(
  () => route.query.session,
  (newVal, oldVal) => {
    if (!newVal && oldVal) {
      resetPaintState()
    }
  },
)

onMounted(async () => {
  await refreshSessions()
  const sessionId = querySessionId()
  if (sessionId) {
    const found = await session.exists(sessionId)
    if (found) {
      await session.load(sessionId)
    } else {
      router.replace({ query: {} })
    }
  }
})

// Tool buttons config
const toolButtons: { name: ToolName; icon: string; label: string; key: string }[] = [
  { name: 'pan', icon: '✋', label: 'Pan', key: 'V' },
  { name: 'brush', icon: '🖌️', label: 'Brush', key: 'B' },
  { name: 'eraser', icon: '🧹', label: 'Eraser', key: 'E' },
  { name: 'rect', icon: '⬜', label: 'Rectangle', key: 'R' },
  { name: 'circle', icon: '⭕', label: 'Circle', key: 'C' },
  { name: 'arrow', icon: '➡️', label: 'Arrow', key: 'A' },
]

const showFilled = computed(() => ['rect', 'circle'].includes(state.activeTool))

const activeCursor = computed(() => {
  const tool = toolManager.getActiveTool()
  return tool?.cursor || 'default'
})

const panelStyle = computed(() => {
  const t = THEMES[state.theme]
  return {
    background: t.uiBg,
    borderColor: t.uiBorder,
    color: t.text,
  }
})

// Pointer events
function onPointerDown(e: PointerEvent) {
  const world = screenToWorld(e.clientX, e.clientY)
  toolManager.handlePointerDown(e, world)
}

function onPointerMove(e: PointerEvent) {
  const world = screenToWorld(e.clientX, e.clientY)
  toolManager.handlePointerMove(e, world)
}

function onPointerUp(e: PointerEvent) {
  const world = screenToWorld(e.clientX, e.clientY)
  toolManager.handlePointerUp(e, world)
}

function onPointerLeave() {
  state.showCursor = false
  state.dirty = true
}

function onWheel(e: WheelEvent) {
  toolManager.handleWheel(e)
}
</script>

<style scoped lang="scss">
.paint-root {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  user-select: none;
}

.canvas-container {
  position: absolute;
  inset: 0;
}

.layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.interactive {
  z-index: 2;
}

// Panels
.panel {
  position: absolute;
  z-index: 10;
  border-radius: 12px;
  border: 1px solid;
  padding: 8px;
  backdrop-filter: blur(12px);
  font-family: 'Reddit Mono', monospace;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.toolbar {
  top: 16px;
  left: 16px;
  gap: 4px;
}

.settings {
  top: 16px;
  right: 16px;
}

.bg-settings {
  bottom: 16px;
  right: 16px;
}

.session-panel {
  bottom: 16px;
  left: 16px;
  max-width: 220px;
}

.zoom-indicator {
  position: absolute;
  z-index: 10;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 8px;
  border: 1px solid;
  padding: 4px 12px;
  font-family: 'Reddit Mono', monospace;
  font-size: 11px;
  backdrop-filter: blur(12px);
}

// Tool buttons
.tool-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background: rgba(255, 255, 255, 0.18);
    box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.25);
  }
}

.tool-icon {
  font-size: 18px;
}

// Form inputs
.label-text {
  font-size: 11px;
  opacity: 0.7;
  margin-bottom: 2px;
  display: block;
}

.color-input {
  width: 100%;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.range-input {
  width: 120px;
  accent-color: #e74c3c;
}

.select-input {
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 4px 8px;
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
}

.text-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 4px 8px;
  font-family: inherit;
  font-size: 11px;
  min-width: 0;
}

.panel-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

// Session list
.session-list {
  max-height: 120px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.session-name {
  flex: 1;
  text-align: left;
  background: none;
  border: none;
  color: inherit;
  font-family: inherit;
  font-size: 11px;
  padding: 3px 6px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}

.sm-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.del:hover {
    background: rgba(231, 76, 60, 0.3);
  }
}
</style>
