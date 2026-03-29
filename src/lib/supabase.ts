import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function initSupabase(url: string, key: string): SupabaseClient {
  client = createClient(url, key)
  return client
}

export function getSupabase(): SupabaseClient {
  if (!client) throw new Error('Supabase not initialized')
  return client
}
