'use client'

import { FormEvent, Suspense, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function ResetForm() {
  const params = useSearchParams()
  const token = params?.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }
    const response = await fetch('/api/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password, confirmPassword }) })
    const data = await response.json()
    if (response.ok) setMessage('Mot de passe modifié. Vous pouvez vous connecter.')
    else setError(data.error ?? 'Impossible de modifier le mot de passe.')
  }

  return <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-[#dcebe4] bg-white p-7 shadow-xl shadow-[#164f3b]/10"><a href="/" className="text-sm font-bold text-[#006a4e]">← Retour à l’accueil</a><h1 className="mt-8 font-serif text-3xl font-bold">Nouveau mot de passe</h1><p className="mt-2 text-sm text-[#6b8179]">Le lien expire après 30 minutes et ne fonctionne qu’une fois.</p><div className="relative mt-7"><label className="text-sm font-semibold">Nouveau mot de passe<input required minLength={8} type={visible ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d4e5dd] px-4 py-3 pr-12" /></label><button type="button" aria-label={visible ? 'Masquer les mots de passe' : 'Afficher les mots de passe'} onClick={() => setVisible(value => !value)} className="absolute right-3 top-9 rounded p-1 text-[#006a4e]">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><label className="mt-4 block text-sm font-semibold">Confirmer le mot de passe<input required minLength={8} type={visible ? 'text' : 'password'} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d4e5dd] px-4 py-3" /></label>{message && <p role="status" className="mt-4 rounded-xl bg-[#e7f5ed] px-3 py-2 text-sm font-semibold text-[#006a4e]">{message}</p>}{error && <p role="alert" className="mt-4 rounded-xl bg-[#fff1ef] px-3 py-2 text-sm font-semibold text-[#a33d32]">{error}</p>}<button className="mt-5 w-full rounded-xl bg-[#006a4e] px-4 py-3 font-bold text-white">Enregistrer</button>{message && <a href="/login" className="mt-5 block text-center font-bold text-[#006a4e]">Se connecter</a>}</form>
}

export default function ResetPasswordPage() { return <main className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-5 py-12 text-[#153b32]"><Suspense fallback={<p>Chargement...</p>}><ResetForm /></Suspense></main> }
