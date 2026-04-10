import { supabase } from './client'
import type { Profile } from '@/types'

export async function getProfile(userId: string): Promise<Profile | null> {
  console.log('[Profiles] getProfile called for userId:', userId)
  const { data, error } = await supabase.rpc('get_profile_by_id', { p_user_id: userId })

  if (error) {
    console.error('[Profiles] getProfile error:', error.message)
    return null
  }

  if (!data || !data.id) {
    console.log('[Profiles] Profile not found')
    return null
  }

  console.log('[Profiles] getProfile SUCCESS:', data.email)
  return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  console.log('[Profiles] updateProfile for:', userId, updates)
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('[Profiles] updateProfile error:', error.message)
    throw error
  }
  console.log('[Profiles] updateProfile SUCCESS')
  return data as Profile
}
