import Link from 'next/link'
import { consumeVerification } from '@/lib/email-verification'

export const dynamic = 'force-dynamic'

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  const verified = typeof token === 'string' && token.length > 0 ? await consumeVerification(token) : false

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5faf7] px-6 py-12">
      <section className="w-full max-w-md rounded-3xl border border-[#d8e9df] bg-white p-8 text-center shadow-sm">
        <Link href="/" className="text-sm font-bold text-[#006a4e]">ASSAR</Link>
        <div className="mt-8" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a9387]">Vérification email</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#15352b]">
            {verified ? 'Email confirmé' : 'Lien invalide ou expiré'}
          </h1>
          <p className="mt-4 leading-7 text-[#5e766b]">
            {verified
              ? 'Votre adresse email est vérifiée. Vous pouvez maintenant vous connecter.'
              : 'Ce lien a déjà été utilisé, est incorrect ou a dépassé sa durée de validité de 30 minutes.'}
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/login" className="rounded-full bg-[#006a4e] px-5 py-3 text-sm font-bold text-white">Se connecter</Link>
          <Link href="/" className="rounded-full border border-[#cfe2d8] px-5 py-3 text-sm font-bold text-[#006a4e]">Retour à l&apos;accueil</Link>
        </div>
      </section>
    </main>
  )
}
