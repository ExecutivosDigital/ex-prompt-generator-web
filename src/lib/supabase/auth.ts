import { supabase } from './client'
import type { Profile } from '@/types'

const STORAGE_KEY = 'ex_user_id'

export function getStoredUserId(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function setStoredUserId(id: string) {
  localStorage.setItem(STORAGE_KEY, id)
}

export function clearStoredUserId() {
  localStorage.removeItem(STORAGE_KEY)
}

export async function signUp(email: string, password: string, fullName: string): Promise<{ profile: Profile }> {
  console.log('[Auth] signUp called')
  console.log('[Auth] signUp params — email:', email, '| name:', fullName, '| password length:', password.length)

  try {
    const { data, error } = await supabase.rpc('register_user', {
      p_full_name: fullName,
      p_email: email,
      p_password: password,
    })

    console.log('[Auth] signUp RPC raw response — data:', JSON.stringify(data), '| error:', error ? JSON.stringify(error) : 'null')

    if (error) {
      console.error('[Auth] signUp RPC error:', error.message, '| code:', error.code, '| details:', error.details, '| hint:', error.hint)
      throw new Error(error.message)
    }

    if (data?.error) {
      console.error('[Auth] signUp business error:', data.error)
      throw new Error(data.error)
    }

    if (!data?.success || !data?.user_id) {
      console.error('[Auth] signUp unexpected response:', data)
      throw new Error('Resposta inesperada do servidor')
    }

    console.log('[Auth] signUp SUCCESS — user_id:', data.user_id)
    console.log('[Auth] signUp profile:', JSON.stringify(data.profile))
    setStoredUserId(data.user_id)
    return { profile: data.profile as Profile }
  } catch (err) {
    console.error('[Auth] signUp CATCH:', err)
    throw err
  }
}

export async function signIn(email: string, password: string): Promise<{ profile: Profile }> {
  console.log('[Auth] signIn called — email:', email)

  try {
    const { data, error } = await supabase.rpc('login_user', {
      p_email: email,
      p_password: password,
    })

    console.log('[Auth] signIn RPC raw response — data:', JSON.stringify(data), '| error:', error ? JSON.stringify(error) : 'null')

    if (error) {
      console.error('[Auth] signIn RPC error:', error.message, '| code:', error.code)
      throw new Error(error.message)
    }

    if (data?.error) {
      console.error('[Auth] signIn business error:', data.error)
      throw new Error(data.error)
    }

    if (!data?.success || !data?.user_id) {
      console.error('[Auth] signIn unexpected response:', data)
      throw new Error('Resposta inesperada do servidor')
    }

    console.log('[Auth] signIn SUCCESS — user_id:', data.user_id)
    setStoredUserId(data.user_id)
    return { profile: data.profile as Profile }
  } catch (err) {
    console.error('[Auth] signIn CATCH:', err)
    throw err
  }
}

export async function signOut() {
  console.log('[Auth] signOut called')
  clearStoredUserId()
}
