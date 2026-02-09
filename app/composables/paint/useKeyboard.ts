import { onMounted, onUnmounted } from 'vue'
import type { PaintState, ToolName } from '~/types/paint'
import type { HistoryManager } from './useHistory'
import type { ToolManager } from './useToolManager'

interface KeyboardCallbacks {
  save: () => void | Promise<void>
}

export function useKeyboard(
  state: PaintState,
  history: HistoryManager,
  toolManager: ToolManager,
  callbacks: KeyboardCallbacks,
) {
  function onKeyDown(e: KeyboardEvent) {
    // skip if user is in an input/textarea
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return

    const ctrl = e.ctrlKey || e.metaKey

    if (ctrl && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      history.undo()
      return
    }
    if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault()
      history.redo()
      return
    }
    if (ctrl && e.key === 's') {
      e.preventDefault()
      callbacks.save()
      return
    }

    // tool hotkeys
    const keyMap: Record<string, ToolName> = {
      v: 'pan',
      b: 'brush',
      e: 'eraser',
      r: 'rect',
      c: 'circle',
      a: 'arrow',
    }
    const tool = keyMap[e.key.toLowerCase()]
    if (tool) {
      toolManager.setTool(tool)
    }

    // +/- brush size
    if (e.key === ']') {
      state.brushWidth = Math.min(50, state.brushWidth + 1)
      state.dirty = true
    }
    if (e.key === '[') {
      state.brushWidth = Math.max(1, state.brushWidth - 1)
      state.dirty = true
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
  })
}
