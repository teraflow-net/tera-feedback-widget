import { bus } from '../lib/state'

export class ToggleButton {
  private el: HTMLButtonElement
  private active = false
  private count = 0

  constructor(private root: ShadowRoot) {
    this.el = document.createElement('button')
    this.el.className = 'tr-toggle tr-toggle--off'
    this.el.addEventListener('click', () => bus.emit('toggle'))

    bus.on('toggle', () => {
      // 이름 미입력 시 toggle이 취소될 수 있으므로, toggle:force로만 ON
      const saved = localStorage.getItem('tera_feedback_author')
      if (!this.active && !saved) return // author modal이 뜰 것
      this.active = !this.active
      this.render()
    })

    bus.on('toggle:force', () => {
      this.active = true
      this.render()
    })
    bus.on('comments:count', (c: number) => {
      this.count = c
      this.render()
    })

    this.render()
    root.appendChild(this.el)
  }

  private render() {
    this.el.className = `tr-toggle ${this.active ? 'tr-toggle--on' : 'tr-toggle--off'}`
    if (this.active) {
      this.el.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        피드백 종료
      `
    } else {
      this.el.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
        피드백 남기기
        ${this.count > 0 ? `<span class="tr-toggle__badge">${this.count}</span>` : ''}
      `
    }
  }

  destroy() {
    this.el.remove()
  }
}
