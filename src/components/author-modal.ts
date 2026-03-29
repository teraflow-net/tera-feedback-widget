import { bus } from '../lib/state'

export class AuthorModal {
  private backdrop: HTMLDivElement | null = null
  private modal: HTMLDivElement | null = null

  constructor(private root: ShadowRoot) {
    bus.on('author:request', () => this.show())
  }

  private show() {
    this.close()

    this.backdrop = document.createElement('div')
    this.backdrop.className = 'tr-author-backdrop'
    this.backdrop.addEventListener('click', () => this.close())

    this.modal = document.createElement('div')
    this.modal.className = 'tr-author-modal'

    const saved = localStorage.getItem('tera_feedback_author') || ''

    this.modal.innerHTML = `
      <div class="tr-author-modal__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </div>
      <h3 class="tr-author-modal__title">리뷰어 이름</h3>
      <p class="tr-author-modal__desc">피드백에 표시될 이름을 입력하세요</p>
      <input type="text" class="tr-author-modal__input" placeholder="예: 홍길동" value="${this.escapeHtml(saved)}" data-input autofocus>
      <button class="tr-author-modal__btn" data-confirm disabled>시작하기</button>
    `

    const input = this.modal.querySelector('[data-input]') as HTMLInputElement
    const btn = this.modal.querySelector('[data-confirm]') as HTMLButtonElement

    const updateBtn = () => {
      btn.disabled = !input.value.trim()
    }
    input.addEventListener('input', updateBtn)
    if (saved) updateBtn()

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        btn.click()
      }
      if (e.key === 'Escape') {
        this.close()
      }
    })

    btn.addEventListener('click', () => {
      const name = input.value.trim()
      if (!name) return
      localStorage.setItem('tera_feedback_author', name)
      this.close()
      bus.emit('author:confirmed', name)
    })

    this.root.appendChild(this.backdrop)
    this.root.appendChild(this.modal)

    // Focus input after render
    requestAnimationFrame(() => input.focus())
  }

  private close() {
    this.backdrop?.remove()
    this.modal?.remove()
    this.backdrop = null
    this.modal = null
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  destroy() {
    this.close()
  }
}
