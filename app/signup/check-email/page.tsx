type Props = { searchParams: Promise<{ sent?: string }> }

export default async function CheckEmailPage({ searchParams }: Props) {
  const params = await searchParams
  const sent = params.sent === '1'
  return <main className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-5 py-12"><section className="w-full max-w-md rounded-3xl border border-[#dcebe4] bg-white p-8 text-center shadow-xl shadow-[#164f3b]/10"><img src="/assar-logo.png" alt="Logo ASSAR" className="mx-auto size-20 object-contain" /><h1 className="mt-5 font-serif text-3xl font-bold text-[#153b32]">Vérifiez votre email</h1><p className="mt-3 text-[#6b8179]">{sent ? 'Un lien de confirmation valable 30 minutes vient d’être envoyé à votre adresse. Ouvrez votre boîte mail et cliquez sur le bouton « Confirmer mon email ». ' : 'Le service email n’a pas pu envoyer le message. Réessayez après avoir vérifié la configuration Resend.'}</p><p className="mt-4 rounded-xl bg-[#eaf5ef] px-4 py-3 text-sm font-semibold text-[#006a4e]">Le lien est uniquement dans l’email et expire après 30 minutes.</p><a href="/" className="mt-6 inline-flex rounded-xl bg-[#006a4e] px-4 py-3 text-sm font-bold text-white">Retour à l’accueil</a><a href="/login" className="mt-4 block text-sm font-semibold text-[#006a4e]">Se connecter</a></section></main>
}
