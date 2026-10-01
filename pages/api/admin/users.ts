import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getUsers, publicUser } from '@/lib/users'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.isAdmin) return res.status(403).json({ error: 'Accès administrateur requis.' })
  if (req.method === 'GET') return res.status(200).json({ users: (await getUsers()).map(publicUser) })
  if (req.method === 'PATCH') {
    const { id, accessLevel } = req.body as { id?: string; accessLevel?: 'free' | 'paid' }
    if (!id || !['free', 'paid'].includes(accessLevel ?? '')) return res.status(400).json({ error: 'Modification invalide.' })
    const { updateAccessLevel } = await import('@/lib/users')
    await updateAccessLevel(id, accessLevel as 'free' | 'paid')
    const user = (await getUsers()).find((candidate) => candidate.id === id)
    return user ? res.status(200).json({ user: publicUser(user) }) : res.status(404).json({ error: 'Utilisateur introuvable.' })
  }
  return res.status(405).json({ error: 'Méthode non autorisée.' })
}
