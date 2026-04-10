import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-white p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-yellow mb-4">404</h1>
        <h2 className="text-xl font-semibold text-brand-black mb-2">Pagina nao encontrada</h2>
        <p className="text-sm text-brand-gray-400 mb-6">A pagina que voce procura nao existe.</p>
        <Link to="/">
          <Button>Voltar ao Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
