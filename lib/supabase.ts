import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  full_name: string
  city_or_zip: string
  latitude: number
  longitude: number
  contact_type: 'facebook' | 'phone' | 'email' | 'other'
  contact_value: string
  about_me?: string
  consent_to_share: boolean
  created_at: string
  user_id: string
}