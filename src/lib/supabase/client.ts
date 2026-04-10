import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from '@/config/constants'

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)
