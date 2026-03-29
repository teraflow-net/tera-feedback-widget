import { initSupabase, getSupabase } from './lib/supabase'
import { bus } from './lib/state'
import { WIDGET_CSS } from './styles'
import { ToggleButton } from './components/toggle-button'
import { PinLayer } from './components/pin-layer'
import { CommentPopover } from './components/comment-popover'
import { ReviewPanel } from './components/review-panel'
import { AuthorModal } from './components/author-modal'
import type { WidgetConfig, ReviewComment, PinPosition } from './types'

export class TeraFeedbackWidget {
  private host: HTMLDivElement
  private shadow: ShadowRoot
  private toggleBtn!: ToggleButton
  private pinLayer!: PinLayer
  private popover!: CommentPopover
  private panel!: ReviewPanel
  private authorModal!: AuthorModal
  private channel: ReturnType<ReturnType<typeof getSupabase>['channel']> | null = null
  private active = false

  constructor(private config: WidgetConfig) {
    // Init Supabase
    initSupabase(config.supabaseUrl, config.supabaseKey)

    // Create host element
    this.host = document.createElement('div')
    this.host.id = 'tera-feedback-root'
    this.host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99999;'
    document.body.appendChild(this.host)

    // Shadow DOM
    this.shadow = this.host.attachShadow({ mode: 'closed' })

    // Inject styles (+ spin animation for loading)
    const style = document.createElement('style')
    style.textContent = WIDGET_CSS + `
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      :host * { pointer-events: auto; }
    `
    this.shadow.appendChild(style)

    // Initialize components
    this.toggleBtn = new ToggleButton(this.shadow)
    this.pinLayer = new PinLayer(this.shadow)
    this.popover = new CommentPopover(this.shadow, config.projectId)
    this.panel = new ReviewPanel(this.shadow, config.projectId)
    this.authorModal = new AuthorModal(this.shadow)

    // Wire up events
    this.setupEvents()

    // Initial data fetch
    this.fetchPageComments()
    this.subscribeRealtime()
  }

  private setupEvents() {
    bus.on('toggle', () => {
      // OFF → ON: 이름 확인
      if (!this.active) {
        const saved = localStorage.getItem('tera_feedback_author')
        if (!saved) {
          bus.emit('author:request')
          return // 이름 입력 전까지 toggle 안 함
        }
      }
      this.active = !this.active
      if (!this.active) {
        this.popover.close()
      }
    })

    bus.on('author:confirmed', () => {
      // 이름 입력 완료 → 리뷰 모드 ON
      this.active = true
      bus.emit('toggle:force')
    })

    bus.on('author:change', () => {
      bus.emit('author:request')
    })

    bus.on('pin:new', (pos: PinPosition) => {
      this.pinLayer.showNewPin(pos)
      this.popover.showNew(pos.x, pos.y, pos.xPercent, pos.yPercent)
    })

    bus.on('pin:click', (comment: ReviewComment) => {
      this.pinLayer.clearNewPin()
      this.popover.showExisting(comment)
    })

    bus.on('pin:created', () => {
      this.pinLayer.clearNewPin()
      this.fetchPageComments()
    })

    bus.on('popover:closed', () => {
      this.pinLayer.clearNewPin()
    })
  }

  private async fetchPageComments() {
    const pageUrl = window.location.pathname + window.location.search
    const supabase = getSupabase()
    const { data } = await supabase
      .from('review_comments')
      .select('*')
      .eq('project_id', this.config.projectId)
      .eq('page_url', pageUrl)
      .order('created_at', { ascending: true })
    if (data) {
      bus.emit('comments:page', data)
    }
  }

  private subscribeRealtime() {
    const pageUrl = window.location.pathname + window.location.search
    const supabase = getSupabase()
    this.channel = supabase
      .channel('review_page_rt')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'review_comments',
        filter: `page_url=eq.${pageUrl}`,
      }, () => this.fetchPageComments())
      .subscribe()
  }

  // Public API
  open() { if (!this.active) bus.emit('toggle') }
  close() { if (this.active) bus.emit('toggle') }
  toggle() { bus.emit('toggle') }

  destroy() {
    if (this.channel) {
      getSupabase().removeChannel(this.channel)
    }
    this.toggleBtn.destroy()
    this.pinLayer.destroy()
    this.popover.destroy()
    this.panel.destroy()
    this.authorModal.destroy()
    this.host.remove()
  }
}
