import type { NextApiRequest, NextApiResponse } from 'next'
import { resetPassword } from '@/lib/password-reset'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' })
  const { token, password, confirmPassword } = req.body ?? {}
  if (typeof token !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string' || password.length < 8) return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' })
  if (password !== confirmPassword) return res.status(400).json({ error: 'Les deux mots de passe ne correspondent pas.' })
  try { const ok = await resetPassword(token, password); return ok ? res.status(200).json({ ok: true }) : res.status(400).json({ error: 'Lien invalide ou expiré.' }) } catch { return res.status(500).json({ error: 'Impossible de modifier le mot de passe.' }) }
}
