import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'

export type LocalUser = { id: string; name: string; email: string; passwordHash: string; accessLevel: 'free' | 'paid'; isAdmin?: boolean; emailVerifiedAt?: string | null }

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function getUsers() {
  const { rows } = await pool.query('SELECT id, name, email, password_hash AS "passwordHash", access_level AS "accessLevel", is_admin AS "isAdmin", email_verified_at AS "emailVerifiedAt" FROM app_users ORDER BY created_at DESC')
  return rows as LocalUser[]
}

export async function findUserByEmail(email: string) {
  const { rows } = await pool.query('SELECT id, name, email, password_hash AS "passwordHash", access_level AS "accessLevel", is_admin AS "isAdmin", email_verified_at AS "emailVerifiedAt" FROM app_users WHERE email = $1 LIMIT 1', [email.trim().toLowerCase()])
  return (rows[0] as LocalUser | undefined) ?? null
}

export async function createUser(input: { name: string; email: string; password: string }) {
  const email = input.email.trim().toLowerCase()
  const existing = await findUserByEmail(email)
  if (existing) throw new Error('EMAIL_EXISTS')
  const id = crypto.randomUUID()
  const passwordHash = await bcrypt.hash(input.password, 12)
  await pool.query('INSERT INTO app_users (id, name, email, password_hash) VALUES ($1, $2, $3, $4)', [id, input.name.trim(), email, passwordHash])
  return { id, name: input.name.trim(), email, passwordHash, accessLevel: 'free' as const }
}

export async function updateAccessLevel(id: string, accessLevel: 'free' | 'paid') {
  await pool.query('UPDATE app_users SET access_level = $1, updated_at = now() WHERE id = $2', [accessLevel, id])
}

export async function markEmailVerified(id: string) {
  await pool.query('UPDATE app_users SET email_verified_at = now(), updated_at = now() WHERE id = $1', [id])
}

export function publicUser(user: LocalUser) {
  return { id: user.id, name: user.name, email: user.email, accessLevel: user.accessLevel, isAdmin: Boolean(user.isAdmin), emailVerifiedAt: user.emailVerifiedAt ?? null }
}

export { pool }
