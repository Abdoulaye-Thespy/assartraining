'use client'

import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('')
    const response = await fetch('/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const result = await response.json()
    if (!response.ok) { setError(result.error); setLoading(false); return }
    await signIn('credentials', { email: form.email, password: form.password, callbackUrl: '/' })
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-5 py-12 text-[#153b32]"><form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-[#dcebe4] bg-white p-7 shadow-xl shadow-[#164f3b]/10"><div className="text-center"><img src="/assar-logo.png" alt="Logo ASSAR" className="mx-auto size-20 object-contain" /><p className="mt-3 text-xs font-bold uppercase tracking-[.18em] text-[#008263]">Espace apprenant</p><h1 className="mt-2 font-serif text-3xl font-bold">Créer un compte</h1><p className="mt-2 text-sm text-[#6b8179]">Commencez avec les deux formations gratuites.</p></div><div className="mt-7 flex flex-col gap-4"><label className="text-sm font-semibold">Nom complet<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-xl border border-[#d4e5dd] px-4 py-3 outline-none focus:ring-2 focus:ring-[#8bc6a9]" /></label><label className="text-sm font-semibold">Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-xl border border-[#d4e5dd] px-4 py-3 outline-none focus:ring-2 focus:ring-[#8bc6a9]" /></label><label className="text-sm font-semibold">Mot de passe<input required minLength={8} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-2 w-full rounded-xl border border-[#d4e5dd] px-4 py-3 outline-none focus:ring-2 focus:ring-[#8bc6a9]" /></label>{error && <p role="alert" className="rounded-xl bg-[#fff1ef] px-3 py-2 text-sm font-semibold text-[#a33d32]">{error}</p>}<button disabled={loading} className="rounded-xl bg-[#006a4e] px-4 py-3 font-bold text-white disabled:opacity-60">{loading ? 'Création...' : 'Créer mon compte'}</button></div><p className="mt-5 text-center text-sm text-[#6b8179]">Déjà inscrit ? <a href="/login" className="font-bold text-[#006a4e]">Se connecter</a></p></form></main>
}
