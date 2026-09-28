import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser } from '@/lib/users'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' })
  const { name, email, password } = req.body as { name?: string; email?: string; password?: string }
  if (!name || !email || !password || password.length < 8) return res.status(400).json({ error: 'Nom, email et mot de passe de 8 caractères minimum requis.' })
  try {
    const user = await createUser({ name, email, password })
    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email } })
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_EXISTS') return res.status(409).json({ error: 'Cet email est déjà utilisé.' })
    return res.status(500).json({ error: 'Impossible de créer le compte.' })
  }
}
