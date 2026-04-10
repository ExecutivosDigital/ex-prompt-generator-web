import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { getToken, clearToken } from '@/lib/api/client'
import { getMe } from '@/lib/api/auth'
import type { Profile } from '@/types'

interface AuthContextType {
  user: { id: string } | null
  profile: Profile | null
  loading: boolean
  setProfile: (profile: Profile | ((prev: Profile | null) => Profile | null) | null) => void
  refreshProfile: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  setProfile: () => {},
  refreshProfile: async () => {},
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [profile, _setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const setProfile = useCallback((value: Profile | ((prev: Profile | null) => Profile | null) | null) => {
    if (typeof value === 'function') {
      _setProfile((prev) => {
        const next = value(prev)
        if (next?.id) setUser({ id: next.id })
        else if (!next) setUser(null)
        return next
      })
    } else {
      _setProfile(value)
      if (value?.id) setUser({ id: value.id })
      else if (!value) setUser(null)
    }
  }, [])

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getMe()
      setUser({ id: data.id })
      _setProfile(data.profile)
    } catch {
      clearToken()
      setUser(null)
      _setProfile(null)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    const token = getToken()
    if (token) await fetchProfile()
  }, [fetchProfile])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    _setProfile(null)
  }, [])

  useEffect(() => {
    const token = getToken()
    if (token) {
      fetchProfile().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [fetchProfile])

  return (
    <AuthContext.Provider value={{ user, profile, loading, setProfile, refreshProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
