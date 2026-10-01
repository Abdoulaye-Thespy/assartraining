import type { NextApiRequest, NextApiResponse } from 'next'
import { consumeVerification } from '@/lib/email-verification'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' || typeof req.query.token !== 'string') return res.status(400).json({ error: 'Lien invalide.' })
  const valid = await consumeVerification(req.query.token)
  if (!valid) return res.status(410).json({ error: 'Ce lien est invalide ou a expiré. Demandez un nouvel email de confirmation.' })
  return res.redirect(302, '/email-confirmed')
}
