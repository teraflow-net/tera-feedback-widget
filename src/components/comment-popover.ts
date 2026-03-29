import { bus } from '../lib/state'
import { getSupabase } from '../lib/supabase'
import { getViewport, getBrowser, getOS } from '../lib/meta'
import type { ReviewComment } from '../types'

export class CommentPopover {
  private backdrop: HTMLDivElement | null = null
  private el: HTMLDivElement | null = null

  constructor(private root: ShadowRoot, private projectId: string) {
    bus.on('popover:close', () => this.close())
  }

  showNew(screenX: number, screenY: number, xPercent: number, yPercent: number) {
    this.close()

    const authorName = localStorage.getItem('tera_feedback_author') || 'Guest'
    let imageFile: File | null = null
    let imagePreviewUrl: string | null = null

    // Backdrop
    this.backdrop = document.createElement('div')
    this.backdrop.className = 'tr-popover-backdrop'
    this.backdrop.addEventListener('click', () => this.close())

    // Popover
    this.el = document.createElement('div')
    this.el.className = 'tr-popover'
    this.el.style.left = `${Math.min(screenX + 12, window.innerWidth - 340)}px`
    this.el.style.top = `${Math.min(screenY - 10, window.innerHeight - 420)}px`

    this.el.innerHTML = `
      <div class="tr-popover__body">
        <div class="tr-popover__author-row" style="margin-bottom:10px">
          <span class="tr-popover__avatar">${this.escapeHtml(authorName.charAt(0))}</span>
          <span class="tr-popover__author">${this.escapeHtml(authorName)}</span>
        </div>
        <div class="tr-popover__dropzone" data-dropzone>
          <textarea placeholder="피드백을 입력하세요... (Ctrl+Enter로 전송)&#10;이미지를 드래그하여 첨부할 수 있습니다" rows="3" data-field="content" autofocus></textarea>
          <div class="tr-popover__drop-hint">이미지를 여기에 놓으세요</div>
        </div>
        <div class="tr-popover__img-preview" style="display:none" data-preview></div>
        <div class="tr-popover__footer">
          <button class="tr-popover__img-btn" data-action="image">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            이미지
          </button>
          <input type="file" accept="image/*" style="display:none" data-file>
          <button class="tr-popover__submit" data-action="submit" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            등록
          </button>
        </div>
      </div>
    `

    const contentArea = this.el.querySelector('[data-field="content"]') as HTMLTextAreaElement
    const submitBtn = this.el.querySelector('[data-action="submit"]') as HTMLButtonElement
    const imageBtn = this.el.querySelector('[data-action="image"]') as HTMLButtonElement
    const fileInput = this.el.querySelector('[data-file]') as HTMLInputElement
    const previewEl = this.el.querySelector('[data-preview]') as HTMLDivElement
    const dropzone = this.el.querySelector('[data-dropzone]') as HTMLDivElement

    const updateSubmitState = () => {
      submitBtn.disabled = !contentArea.value.trim()
    }
    contentArea.addEventListener('input', updateSubmitState)

    // Drag & drop
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault()
      e.stopPropagation()
      dropzone.classList.add('tr-popover__dropzone--dragover')
    })
    dropzone.addEventListener('dragleave', (e) => {
      e.preventDefault()
      e.stopPropagation()
      dropzone.classList.remove('tr-popover__dropzone--dragover')
    })
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault()
      e.stopPropagation()
      dropzone.classList.remove('tr-popover__dropzone--dragover')
      const file = (e as DragEvent).dataTransfer?.files[0]
      if (file && file.type.startsWith('image/')) {
        setImage(file)
      }
    })

    // Paste image
    contentArea.addEventListener('paste', (e) => {
      const items = (e as ClipboardEvent).clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) setImage(file)
          break
        }
      }
    })

    const setImage = (file: File) => {
      imageFile = file
      const reader = new FileReader()
      reader.onload = () => {
        imagePreviewUrl = reader.result as string
        previewEl.style.display = ''
        previewEl.innerHTML = `
          <img src="${imagePreviewUrl}" alt="첨부">
          <button class="tr-popover__img-remove" data-action="remove-image">&times;</button>
        `
        previewEl.querySelector('[data-action="remove-image"]')?.addEventListener('click', () => {
          imageFile = null
          imagePreviewUrl = null
          previewEl.style.display = 'none'
          previewEl.innerHTML = ''
          fileInput.value = ''
        })
      }
      reader.readAsDataURL(file)
    }

    imageBtn.addEventListener('click', () => fileInput.click())
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0]
      if (file) setImage(file)
    })

    // Keyboard
    this.el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        submitBtn.click()
      }
      if (e.key === 'Escape') {
        this.close()
      }
    })

    // Submit
    submitBtn.addEventListener('click', async () => {
      const content = contentArea.value.trim()
      if (!content) return
      const name = authorName

      submitBtn.disabled = true
      submitBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
        등록 중...
      `

      let imageUrl: string | null = null
      if (imageFile) {
        imageUrl = await this.uploadImage(imageFile)
      }

      const supabase = getSupabase()
      const row: Record<string, unknown> = {
        project_id: this.projectId,
        page_url: window.location.pathname + window.location.search,
        x_percent: xPercent,
        y_percent: yPercent,
        content,
        author_name: name,
        image_url: imageUrl,
      }

      // meta 컬럼이 있으면 저장 (ALTER 실행 전에도 동작)
      const { error } = await supabase.from('review_comments').insert({
        ...row,
        meta_viewport: getViewport(),
        meta_browser: getBrowser(),
        meta_os: getOS(),
      })

      // meta 컬럼 없으면 fallback (column not found 에러)
      if (error) {
        await supabase.from('review_comments').insert(row)
      }

      this.close()
      bus.emit('pin:created')
    })

    this.root.appendChild(this.backdrop)
    this.root.appendChild(this.el)
  }

  showExisting(comment: ReviewComment) {
    this.close()

    const screenX = (comment.x_percent / 100) * window.innerWidth
    const screenY = (comment.y_percent / 100) * window.innerHeight

    this.backdrop = document.createElement('div')
    this.backdrop.className = 'tr-popover-backdrop'
    this.backdrop.addEventListener('click', () => this.close())

    this.el = document.createElement('div')
    this.el.className = 'tr-popover'
    this.el.style.left = `${Math.min(screenX + 12, window.innerWidth - 340)}px`
    this.el.style.top = `${Math.min(screenY - 10, window.innerHeight - 420)}px`

    const statusClass = `tr-popover__status--${comment.status}`
    const statusLabel = { open: '미처리', in_progress: '진행중', resolved: '완료' }[comment.status]
    const dateStr = new Date(comment.created_at).toLocaleDateString('ko-KR')

    let actionsHtml = ''
    if (comment.status === 'open') {
      actionsHtml += `<button class="tr-popover__action tr-popover__action--progress" data-status="in_progress">진행중</button>`
    }
    if (comment.status === 'open' || comment.status === 'in_progress') {
      actionsHtml += `<button class="tr-popover__action tr-popover__action--resolve" data-status="resolved">&#10003; 완료</button>`
    }
    if (comment.status === 'resolved') {
      actionsHtml += `<button class="tr-popover__action tr-popover__action--reopen" data-status="open">다시 열기</button>`
    }
    actionsHtml += `<button class="tr-popover__action tr-popover__action--delete" data-action="delete">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
    </button>`

    this.el.innerHTML = `
      <div class="tr-popover__body">
        <div class="tr-popover__header">
          <div style="display:flex;align-items:center;gap:8px">
            <span class="tr-popover__author">${this.escapeHtml(comment.author_name)}</span>
            <span class="tr-popover__status ${statusClass}">${statusLabel}</span>
          </div>
          <span class="tr-popover__date">${dateStr}</span>
        </div>
        <p class="tr-popover__content">${this.escapeHtml(comment.content)}</p>
        ${comment.image_url ? `
          <div class="tr-popover__img-wrap">
            <img class="tr-popover__image" src="${this.escapeHtml(comment.image_url)}" alt="첨부 이미지" data-action="open-image">
            <div class="tr-popover__img-actions">
              <button class="tr-popover__img-action" data-action="open-image" title="새 탭에서 보기">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </button>
              <button class="tr-popover__img-action" data-action="download-image" title="다운로드">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </button>
            </div>
          </div>
        ` : ''}
        <div class="tr-popover__actions">${actionsHtml}</div>
      </div>
    `

    // Status buttons
    this.el.querySelectorAll('[data-status]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const status = (btn as HTMLElement).dataset.status as ReviewComment['status']
        const supabase = getSupabase()
        await supabase.from('review_comments').update({
          status,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null,
        }).eq('id', comment.id)
        this.close()
      })
    })

    // Delete
    this.el.querySelector('[data-action="delete"]')?.addEventListener('click', async () => {
      const supabase = getSupabase()
      await supabase.from('review_comments').delete().eq('id', comment.id)
      this.close()
    })

    // Open image in new tab
    this.el.querySelectorAll('[data-action="open-image"]').forEach(el => {
      el.addEventListener('click', () => window.open(comment.image_url!, '_blank'))
    })

    // Download image
    this.el.querySelector('[data-action="download-image"]')?.addEventListener('click', async () => {
      try {
        const res = await fetch(comment.image_url!)
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `feedback-${comment.id.slice(0, 8)}.${comment.image_url!.split('.').pop() || 'png'}`
        a.click()
        URL.revokeObjectURL(url)
      } catch {
        window.open(comment.image_url!, '_blank')
      }
    })

    // Escape to close
    this.el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close()
    })

    this.root.appendChild(this.backdrop)
    this.root.appendChild(this.el)
  }

  private async uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop() || 'png'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const supabase = getSupabase()
    const { error } = await supabase.storage.from('review-images').upload(fileName, file)
    if (error) {
      console.error('Image upload failed:', error)
      return null
    }
    const { data } = supabase.storage.from('review-images').getPublicUrl(fileName)
    return data.publicUrl
  }

  close() {
    this.backdrop?.remove()
    this.el?.remove()
    this.backdrop = null
    this.el = null
    bus.emit('popover:closed')
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
