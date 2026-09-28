import bcrypt from 'bcryptjs'

export type LocalUser = { id: string; name: string; email: string; passwordHash: string; accessLevel: 'free' | 'paid'; isAdmin?: boolean }

let runtimeUsers: LocalUser[] | null = null

export function getUsers() {
  if (!runtimeUsers) {
    try {
      runtimeUsers = JSON.parse(process.env.AUTH_USERS_JSON ?? '[]') as LocalUser[]
    } catch {
      runtimeUsers = []
    }
  }
  return runtimeUsers
}

export async function createUser(input: { name: string; email: string; password: string }) {
  const users = getUsers()
  const email = input.email.trim().toLowerCase()
  if (users.some((user) => user.email.toLowerCase() === email)) throw new Error('EMAIL_EXISTS')
  const user: LocalUser = { id: crypto.randomUUID(), name: input.name.trim(), email, passwordHash: await bcrypt.hash(input.password, 12), accessLevel: 'free' }
  users.push(user)
  return user
}

export function publicUser(user: LocalUser) {
  return { id: user.id, name: user.name, email: user.email, accessLevel: user.accessLevel, isAdmin: Boolean(user.isAdmin) }
}
