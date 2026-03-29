export type ReviewComment = {
  id: string
  project_id: string
  page_url: string
  x_percent: number
  y_percent: number
  content: string
  status: 'open' | 'in_progress' | 'resolved'
  author_name: string
  image_url: string | null
  created_at: string
  resolved_at: string | null
}

export type WidgetConfig = {
  projectId: string
  supabaseUrl: string
  supabaseKey: string
}

export type PinPosition = {
  x: number
  y: number
  xPercent: number
  yPercent: number
}
