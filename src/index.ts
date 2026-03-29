import { TeraFeedbackWidget } from './widget'
import type { WidgetConfig } from './types'

declare global {
  interface Window {
    TeraFeedback: TeraFeedbackWidget | null
  }
}

function init() {
  // Find the script tag
  const script = document.currentScript as HTMLScriptElement
    || document.querySelector('script[data-project]')

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

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.TeraFeedback = new TeraFeedbackWidget(config)
    })
  } else {
    window.TeraFeedback = new TeraFeedbackWidget(config)
  }
}

init()
