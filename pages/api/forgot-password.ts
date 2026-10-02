import type { NextApiRequest, NextApiResponse } from 'next'
import { sendPasswordReset } from '@/lib/password-reset'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' })
  const email = typeof req.body?.email === 'string' ? req.body.email : ''
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email invalide.' })
  try { await sendPasswordReset(email) } catch { return res.status(500).json({ error: 'Impossible d’envoyer le lien pour le moment.' }) }
  return res.status(200).json({ message: 'Si un compte correspond à cet email, un lien a été envoyé.' })
}
