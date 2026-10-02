import crypto from 'crypto'
import { Resend } from 'resend'
import { pool } from '@/lib/users'

const RESET_WINDOW_MS = 30 * 60 * 1000

export async function sendPasswordReset(email: string) {
  const normalized = email.trim().toLowerCase()
  const { rows } = await pool.query('SELECT id, name, email FROM app_users WHERE email = $1 LIMIT 1', [normalized])
  if (!rows[0]) return
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  await pool.query('DELETE FROM email_verification_tokens WHERE user_id = $1', [rows[0].id])
  await pool.query('INSERT INTO email_verification_tokens (token_hash, user_id, expires_at) VALUES ($1, $2, $3)', [tokenHash, rows[0].id, new Date(Date.now() + RESET_WINDOW_MS)])
  const baseUrl = process.env.APP_BASE_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const link = `${baseUrl}/reset-password?token=${token}`
  const resend = new Resend(process.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY_2)
  const { error } = await resend.emails.send({ from: process.env.RESEND_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL_2 ?? 'ASSAR <onboarding@resend.dev>', to: [normalized], subject: 'Réinitialisez votre mot de passe ASSAR', html: `<p>Bonjour ${rows[0].name},</p><p><a href="${link}">Créer un nouveau mot de passe</a></p><p>Ce lien expire dans 30 minutes et ne peut être utilisé qu'une seule fois.</p>` }, { idempotencyKey: `password-reset/${rows[0].id}/${tokenHash}` })
  if (error) throw new Error('EMAIL_SEND_FAILED')
}

export async function resetPassword(token: string, password: string) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await client.query('DELETE FROM email_verification_tokens WHERE token_hash = $1 AND expires_at > now() RETURNING user_id', [tokenHash])
    if (!result.rows[0]) { await client.query('ROLLBACK'); return false }
    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.hash(password, 12)
    await client.query('UPDATE app_users SET password_hash = $1, updated_at = now() WHERE id = $2', [passwordHash, result.rows[0].user_id])
    await client.query('COMMIT')
    return true
  } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
}
