import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getUsers, publicUser } from '@/lib/users'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.isAdmin) return res.status(403).json({ error: 'Accès administrateur requis.' })
  const users = getUsers()
  if (req.method === 'GET') return res.status(200).json({ users: users.map(publicUser) })
  if (req.method === 'PATCH') {
    const { id, accessLevel } = req.body as { id?: string; accessLevel?: 'free' | 'paid' }
    const user = users.find((candidate) => candidate.id === id)
    if (!user || !['free', 'paid'].includes(accessLevel ?? '')) return res.status(400).json({ error: 'Modification invalide.' })
    user.accessLevel = accessLevel as 'free' | 'paid'
    return res.status(200).json({ user: publicUser(user) })
  }
  return res.status(405).json({ error: 'Méthode non autorisée.' })
}
