'use client'

import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, callbackUrl: '/', redirect: false })
    if (result?.error) setError('Email ou mot de passe incorrect.')
    else window.location.href = result?.url ?? '/'
    setLoading(false)
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-5 py-12 text-[#153b32]"><form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-[#dcebe4] bg-white p-7 shadow-xl shadow-[#164f3b]/10"><div className="text-center"><img src="/assar-logo.png" alt="Logo ASSAR" className="mx-auto size-20 object-contain" /><p className="mt-3 text-xs font-bold uppercase tracking-[.18em] text-[#008263]">Espace apprenant</p><h1 className="mt-2 font-serif text-3xl font-bold">Se connecter</h1><p className="mt-2 text-sm text-[#6b8179]">Accédez à vos formations ASSAR.</p></div><div className="mt-7 flex flex-col gap-4"><label className="text-sm font-semibold">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d4e5dd] px-4 py-3 outline-none focus:ring-2 focus:ring-[#8bc6a9]" /></label><label className="text-sm font-semibold">Mot de passe<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d4e5dd] px-4 py-3 outline-none focus:ring-2 focus:ring-[#8bc6a9]" /></label>{error && <p role="alert" className="rounded-xl bg-[#fff1ef] px-3 py-2 text-sm font-semibold text-[#a33d32]">{error}</p>}<button disabled={loading} className="rounded-xl bg-[#006a4e] px-4 py-3 font-bold text-white disabled:opacity-60">{loading ? 'Connexion...' : 'Se connecter'}</button></div><p className="mt-5 text-center text-sm text-[#6b8179]">Pas encore de compte ? <a href="/signup" className="font-bold text-[#006a4e]">Créer un compte</a></p><a href="/" className="mt-3 block text-center text-sm font-semibold text-[#006a4e]">Retour aux formations</a></form></main>
}
