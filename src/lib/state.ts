type Listener = (...args: any[]) => void

export class EventBus {
  private listeners = new Map<string, Set<Listener>>()

  on(event: string, fn: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(fn)
  }

  off(event: string, fn: Listener) {
    this.listeners.get(event)?.delete(fn)
  }

  emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach(fn => fn(...args))
  }
}

export const bus = new EventBus()
