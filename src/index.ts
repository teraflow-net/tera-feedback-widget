import { TeraFeedbackWidget } from './widget'
import type { WidgetConfig } from './types'

declare global {
  interface Window {
    TeraFeedback: TeraFeedbackWidget | null
  }
}

function init() {
  // Find the script tag — try multiple methods
  const script = document.currentScript as HTMLScriptElement
    || document.querySelector('script[data-project]')
    || document.querySelector('script[src*="feedback-widget"]')

  if (!script) {
    console.error('[TeraFeedback] script tag with data-project not found')
    return
  }

  const projectId = script.getAttribute('data-project')
  const supabaseUrl = script.getAttribute('data-supabase-url')
  const supabaseKey = script.getAttribute('data-supabase-key')

  if (!projectId || !supabaseUrl || !supabaseKey) {
    console.error('[TeraFeedback] Missing required attributes: data-project, data-supabase-url, data-supabase-key')
    return
  }

  const config: WidgetConfig = { projectId, supabaseUrl, supabaseKey }
  window.TeraFeedback = new TeraFeedbackWidget(config)
}

// Support both sync and defer/async loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
