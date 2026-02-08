import type { PaintState, DrawElement, HistoryAction } from '~/types/paint'

export interface HistoryManager {
  record(action: HistoryAction): void
  undo(): void
  redo(): void
  canUndo(): boolean
  canRedo(): boolean
}

export function useHistory(state: PaintState): HistoryManager {
  const undoStack: HistoryAction[] = []
  const redoStack: HistoryAction[] = []

  function record(action: HistoryAction) {
    undoStack.push(action)
    redoStack.length = 0
  }

  function undo() {
    const action = undoStack.pop()
    if (!action) return
    applyInverse(action)
    redoStack.push(action)
    state.dirty = true
  }

  function redo() {
    const action = redoStack.pop()
    if (!action) return
    applyForward(action)
    undoStack.push(action)
    state.dirty = true
  }

  function applyInverse(action: HistoryAction) {
    if (action.type === 'add') {
      const ids = new Set(action.items.map(i => i.id))
      state.elements = state.elements.filter(el => !ids.has(el.id))
    } else {
      state.elements.push(...action.items)
    }
  }

  function applyForward(action: HistoryAction) {
    if (action.type === 'add') {
      state.elements.push(...action.items)
    } else {
      const ids = new Set(action.items.map(i => i.id))
      state.elements = state.elements.filter(el => !ids.has(el.id))
    }
  }

  return { record, undo, redo, canUndo: () => undoStack.length > 0, canRedo: () => redoStack.length > 0 }
}
