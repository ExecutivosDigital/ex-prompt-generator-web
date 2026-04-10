import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Spinner from '@/components/ui/Spinner'

export default function ProtectedRoute() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-white">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!profile) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
