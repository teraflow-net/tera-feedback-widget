import { bus } from '../lib/state'
import type { ReviewComment, PinPosition } from '../types'

const PIN_COLORS: Record<ReviewComment['status'], string> = {
  open: 'tr-pin--open',
  in_progress: 'tr-pin--in_progress',
  resolved: 'tr-pin--resolved',
}

export class PinLayer {
  private el: HTMLDivElement
  private topbar: HTMLDivElement
  private showResolved = false
  private comments: ReviewComment[] = []
  private active = false

  constructor(private root: ShadowRoot) {
    this.el = document.createElement('div')
    this.el.className = 'tr-pin-layer'
    this.el.style.display = 'none'
    this.el.addEventListener('click', (e) => this.handleClick(e))

    this.topbar = document.createElement('div')
    this.topbar.className = 'tr-topbar'
    this.topbar.style.display = 'none'

    root.appendChild(this.topbar)
    root.appendChild(this.el)

    const activate = (on: boolean) => {
      this.active = on
      this.el.style.display = on ? '' : 'none'
      this.topbar.style.display = on ? '' : 'none'
      if (!on) bus.emit('popover:close')
      this.render()
    }

    bus.on('toggle', () => {
      const saved = localStorage.getItem('tera_feedback_author')
      if (!this.active && !saved) return
      activate(!this.active)
    })

    bus.on('toggle:force', () => activate(true))

    bus.on('comments:page', (comments: ReviewComment[]) => {
      this.comments = comments
      bus.emit('comments:count', comments.filter(c => c.status !== 'resolved').length)
      this.render()
    })

    bus.on('popover:close', () => this.render())
  }

  private handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (target.closest('[data-pin]')) return

    const rect = this.el.getBoundingClientRect()
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100

    const pos: PinPosition = {
      x: e.clientX,
      y: e.clientY,
      xPercent,
      yPercent,
    }

    bus.emit('pin:new', pos)
  }

  private render() {
    // Top bar
    const authorName = localStorage.getItem('tera_feedback_author') || ''
    this.topbar.innerHTML = `
      <span class="tr-topbar__author">
        <span class="tr-topbar__avatar">${this.escapeHtml(authorName.charAt(0))}</span>
        ${this.escapeHtml(authorName)}
        <button class="tr-topbar__change" data-action="change-author">변경</button>
      </span>
      <span class="tr-topbar__sep"></span>
      <span>화면을 클릭하여 피드백을 남기세요</span>
      <label>
        <input type="checkbox" ${this.showResolved ? 'checked' : ''}>
        완료 표시
      </label>
      <button class="tr-topbar__btn" data-action="panel">피드백 목록</button>
    `
    const checkbox = this.topbar.querySelector('input')
    checkbox?.addEventListener('change', () => {
      this.showResolved = checkbox.checked
      this.render()
    })
    const panelBtn = this.topbar.querySelector('[data-action="panel"]')
    panelBtn?.addEventListener('click', (e) => {
      e.stopPropagation()
      bus.emit('panel:toggle')
    })
    const changeBtn = this.topbar.querySelector('[data-action="change-author"]')
    changeBtn?.addEventListener('click', (e) => {
      e.stopPropagation()
      bus.emit('author:change')
    })

    // Clear existing pins
    this.el.querySelectorAll('[data-pin]').forEach(p => p.remove())
    this.el.querySelectorAll('.tr-pin--new').forEach(p => p.remove())

    // Render pins
    const visible = this.showResolved
      ? this.comments
      : this.comments.filter(c => c.status !== 'resolved')

    visible.forEach((comment, i) => {
      const pin = document.createElement('button')
      pin.setAttribute('data-pin', comment.id)
      pin.className = `tr-pin ${PIN_COLORS[comment.status]}`
      pin.style.left = `${comment.x_percent}%`
      pin.style.top = `${comment.y_percent}%`
      pin.textContent = String(i + 1)
      pin.addEventListener('click', (e) => {
        e.stopPropagation()
        bus.emit('pin:click', comment)
      })
      this.el.appendChild(pin)
    })
  }

  showNewPin(pos: PinPosition) {
    this.el.querySelectorAll('.tr-pin--new').forEach(p => p.remove())
    const pin = document.createElement('div')
    pin.className = 'tr-pin tr-pin--new'
    pin.style.left = `${pos.xPercent}%`
    pin.style.top = `${pos.yPercent}%`
    pin.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>`
    this.el.appendChild(pin)
  }

  clearNewPin() {
    this.el.querySelectorAll('.tr-pin--new').forEach(p => p.remove())
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  destroy() {
    this.el.remove()
    this.topbar.remove()
  }
}
