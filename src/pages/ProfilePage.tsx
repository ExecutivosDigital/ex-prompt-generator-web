import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Save, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { updateProfile } from '@/lib/api/auth'
import GlassCard from '@/components/ui/GlassCard'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'

export default function ProfilePage() {
  const { user, profile, refreshProfile, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState(profile?.display_name || profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateProfile({ display_name: displayName, phone })
      await refreshProfile()
      toast('Perfil atualizado com sucesso!', 'success')
    } catch {
      toast('Erro ao salvar perfil', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <GlassCard>
        <h2 className="text-lg font-bold text-brand-black mb-6">Informacoes do Perfil</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-gray-200/20">
            <div className="w-14 h-14 rounded-full bg-brand-yellow/20 flex items-center justify-center">
              <span className="text-xl font-bold text-brand-yellow-dark">
                {(displayName || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-brand-black">{displayName || 'Usuario'}</p>
              <p className="text-sm text-brand-gray-400">{profile?.email}</p>
            </div>
          </div>

          <Input
            id="display_name"
            label="Nome de exibicao"
            placeholder="Como voce quer ser chamado"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            icon={<User size={18} />}
          />

          <div>
            <label className="block text-sm font-medium text-brand-gray-600 mb-1.5">Email</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-gray-200/20 text-sm text-brand-gray-400">
              <Mail size={18} />
              {profile?.email}
            </div>
          </div>

          <Input
            id="phone"
            label="Telefone (opcional)"
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          <Button onClick={handleSave} loading={saving}>
            <Save size={16} /> Salvar alteracoes
          </Button>
        </div>
      </GlassCard>

      {/* Profile Info */}
      {profile?.quiz_completed && (
        <GlassCard>
          <h3 className="font-semibold text-brand-black mb-3">Dados do Quiz</h3>
          <div className="flex flex-wrap gap-2">
            {profile.work_routine && <Badge variant="yellow">{profile.work_routine}</Badge>}
            {profile.ai_experience && <Badge variant="outline">{profile.ai_experience}</Badge>}
            {profile.tech_comfort && <Badge variant="outline">Tech: {profile.tech_comfort}/10</Badge>}
            {profile.data_frequency && <Badge variant="outline">{profile.data_frequency}</Badge>}
          </div>
        </GlassCard>
      )}

      {/* Logout */}
      <button
        onClick={() => { logout(); navigate('/login') }}
        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 active:bg-red-100 transition-all cursor-pointer"
      >
        <LogOut size={16} /> Sair da conta
      </button>
    </div>
  )
}
