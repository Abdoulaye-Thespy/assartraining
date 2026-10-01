type Props = { searchParams: Promise<{ sent?: string; preview?: string }> }

export default async function CheckEmailPage({ searchParams }: Props) {
  const params = await searchParams
  const sent = params.sent === '1'
  const preview = params.preview
  return <main className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-5"><section className="w-full max-w-md rounded-3xl border border-[#dcebe4] bg-white p-8 text-center shadow-xl shadow-[#164f3b]/10"><img src="/assar-logo.png" alt="Logo ASSAR" className="mx-auto size-20 object-contain" /><h1 className="mt-5 font-serif text-3xl font-bold text-[#153b32]">Vérifiez votre email</h1><p className="mt-3 text-[#6b8179]">{sent ? 'Un lien de confirmation valable 30 minutes vient de vous être envoyé.' : 'Le service email est en attente de configuration.'}</p>{preview && <a href={preview} className="mt-5 inline-flex rounded-xl bg-[#eaf5ef] px-4 py-3 text-sm font-bold text-[#006a4e]">Ouvrir le lien de prévisualisation</a>}<a href="/" className="mt-6 block text-sm font-semibold text-[#006a4e]">Retour à l’accueil</a></section></main>
}
