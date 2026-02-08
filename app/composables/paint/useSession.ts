import type { PaintState, PaintSession } from '~/types/paint'
import { uid } from './utils'

const DB_NAME = 'paint-sessions'
const STORE_NAME = 'sessions'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export interface SessionManager {
  save(): Promise<void>
  load(id: string): Promise<void>
  list(): Promise<PaintSession[]>
  remove(id: string): Promise<void>
}

export function useSession(state: PaintState): SessionManager {
  async function save() {
    const db = await openDB()
    if (!state.sessionId) state.sessionId = uid()
    const session: PaintSession = {
      id: state.sessionId,
      name: state.sessionName,
      elements: JSON.parse(JSON.stringify(state.elements)),
      camera: { ...state.camera },
      timestamp: Date.now(),
    }
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put(session)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  async function load(id: string) {
    const db = await openDB()
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).get(id)
      req.onsuccess = () => {
        const session = req.result as PaintSession | undefined
        if (!session) return reject(new Error('Session not found'))
        state.elements = session.elements
        state.camera = session.camera
        state.sessionId = session.id
        state.sessionName = session.name
        state.dirty = true
        resolve()
      }
      req.onerror = () => reject(req.error)
    })
  }

  async function list(): Promise<PaintSession[]> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).getAll()
      req.onsuccess = () => resolve(req.result as PaintSession[])
      req.onerror = () => reject(req.error)
    })
  }

  async function remove(id: string) {
    const db = await openDB()
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  return { save, load, list, remove }
}
