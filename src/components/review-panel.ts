import { bus } from '../lib/state'
import { getSupabase } from '../lib/supabase'
import type { ReviewComment } from '../types'

type Tab = 'open' | 'resolved'

export class ReviewPanel {
  private el: HTMLDivElement
  private tab: Tab = 'open'
  private allComments: ReviewComment[] = []
  private isOpen = false
  private channel: ReturnType<ReturnType<typeof getSupabase>['channel']> | null = null

  constructor(private root: ShadowRoot, private projectId: string) {
    this.el = document.createElement('div')
    this.el.className = 'tr-panel'
    root.appendChild(this.el)

    bus.on('panel:toggle', () => {
      this.isOpen = !this.isOpen
      if (this.isOpen) this.open()
      else this.close()
    })

    bus.on('toggle', () => {
      // Review mode toggled off → close panel
      if (this.isOpen) {
        this.isOpen = false
        this.el.classList.remove('tr-panel--open')
        this.unsubscribe()
      }
    })

    this.render()
  }

  private async fetchAll() {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('review_comments')
      .select('*')
      .eq('project_id', this.projectId)
      .order('created_at', { ascending: false })
    if (data) {
      this.allComments = data
      this.render()
    }
  }

  private subscribe() {
    this.unsubscribe()
    const supabase = getSupabase()
    this.channel = supabase
      .channel('review_panel_rt')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'review_comments',
        filter: `project_id=eq.${this.projectId}`,
      }, () => this.fetchAll())
      .subscribe()
  }

  private unsubscribe() {
    if (this.channel) {
      getSupabase().removeChannel(this.channel)
      this.channel = null
    }
  }

  private open() {
    this.isOpen = true
    this.el.classList.add('tr-panel--open')
    this.fetchAll()
    this.subscribe()
  }

  private close() {
    this.isOpen = false
    this.el.classList.remove('tr-panel--open')
    this.unsubscribe()
  }

  private render() {
    const openCount = this.allComments.filter(c => c.status !== 'resolved').length
    const resolvedCount = this.allComments.filter(c => c.status === 'resolved').length

    const filtered = this.allComments.filter(c =>
      this.tab === 'open' ? c.status !== 'resolved' : c.status === 'resolved'
    )

    // Group by page_url
    const grouped: Record<string, ReviewComment[]> = {}
    filtered.forEach(c => {
      if (!grouped[c.page_url]) grouped[c.page_url] = []
      grouped[c.page_url].push(c)
    })

    const statusIcon = (status: ReviewComment['status']) => {
      const icons: Record<ReviewComment['status'], { html: string; cls: string }> = {
        open: { html: '●', cls: 'tr-panel__item-icon--open' },
        in_progress: { html: '◐', cls: 'tr-panel__item-icon--in_progress' },
        resolved: { html: '✓', cls: 'tr-panel__item-icon--resolved' },
      }
      return icons[status]
    }

    let listHtml = ''
    if (Object.keys(grouped).length === 0) {
      listHtml = `<div class="tr-panel__empty">${this.tab === 'open' ? '처리할 피드백이 없습니다' : '완료된 피드백이 없습니다'}</div>`
    } else {
      for (const [pageUrl, comments] of Object.entries(grouped)) {
        listHtml += `
          <div class="tr-panel__group-header">
            <span class="tr-panel__group-icon">📄</span>
            <span class="tr-panel__group-label">${this.escapeHtml(pageUrl)}</span>
            <span class="tr-panel__group-count">${comments.length}건</span>
          </div>
        `
        comments.forEach(comment => {
          const icon = statusIcon(comment.status)
          const dateStr = new Date(comment.created_at).toLocaleDateString('ko-KR')
          listHtml += `
            <button class="tr-panel__item" data-comment-id="${comment.id}">
              <span class="tr-panel__item-icon ${icon.cls}">${icon.html}</span>
              <div class="tr-panel__item-body">
                <div class="tr-panel__item-meta">
                  <span class="tr-panel__item-author">${this.escapeHtml(comment.author_name)}</span>
                  <span class="tr-panel__item-date">${dateStr}</span>
                </div>
                <div class="tr-panel__item-text">${this.escapeHtml(comment.content)}</div>
                ${comment.image_url ? `<div class="tr-panel__item-thumb"><img src="${this.escapeHtml(comment.image_url)}" alt="첨부"></div>` : ''}
              </div>
            </button>
          `
        })
      }
    }

    this.el.innerHTML = `
      <div class="tr-panel__header">
        <span class="tr-panel__title">피드백 목록</span>
        <button class="tr-panel__close" data-action="close">&times;</button>
      </div>
      <div class="tr-panel__tabs">
        <button class="tr-panel__tab ${this.tab === 'open' ? 'tr-panel__tab--active' : ''}" data-tab="open">
          미처리 / 진행중 (${openCount})
        </button>
        <button class="tr-panel__tab ${this.tab === 'resolved' ? 'tr-panel__tab--active' : ''}" data-tab="resolved">
          완료 (${resolvedCount})
        </button>
      </div>
      <div class="tr-panel__list">${listHtml}</div>
      <div class="tr-panel__footer">
        전체 ${this.allComments.length}건 · 미처리 ${openCount}건 · 완료 ${resolvedCount}건
      </div>
    `

    // Events
    this.el.querySelector('[data-action="close"]')?.addEventListener('click', () => {
      this.close()
    })

    this.el.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.tab = (btn as HTMLElement).dataset.tab as Tab
        this.render()
      })
    })

    this.el.querySelectorAll('[data-comment-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).dataset.commentId
        const comment = this.allComments.find(c => c.id === id)
        if (!comment) return

        // If different page, navigate
        const currentPath = window.location.pathname + window.location.search
        if (comment.page_url !== currentPath) {
          window.location.href = comment.page_url
          return
        }

        // Same page → highlight pin
        this.close()
        setTimeout(() => bus.emit('pin:click', comment), 100)
      })
    })
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  destroy() {
    this.unsubscribe()
    this.el.remove()
  }
}
