import crypto from 'crypto'
import { Resend } from 'resend'
import { pool } from './users'

const EXPIRY_MINUTES = 30

export async function createVerification(userId: string, email: string, name: string) {
  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
  await pool.query('DELETE FROM email_verification_tokens WHERE user_id = $1', [userId])
  await pool.query('INSERT INTO email_verification_tokens (token_hash, user_id, expires_at) VALUES ($1, $2, now() + interval \'30 minutes\')', [tokenHash, userId])
  const baseUrl = process.env.APP_BASE_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const link = `${baseUrl}/verify-email?token=${rawToken}`
  const resendApiKey = process.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY_2
  const resendFromEmail = process.env.RESEND_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL_2
  if (!resendApiKey || !resendFromEmail) throw new Error('EMAIL_NOT_CONFIGURED')
  const resend = new Resend(resendApiKey)
  const { error } = await resend.emails.send({ from: resendFromEmail, to: [email], subject: 'Confirmez votre adresse email ASSAR', html: `<p>Bonjour,</p><p>Confirmez votre email dans les 30 minutes :</p><p><a href="${link}">Confirmer mon email</a></p><p>Ce lien expire après 30 minutes et ne peut être utilisé qu'une seule fois.</p>` }, { idempotencyKey: `verify-email/${userId}/${tokenHash}` })
  if (error) throw new Error('EMAIL_SEND_FAILED')
  return { delivered: true }
}

export async function consumeVerification(rawToken: string) {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
  const { rows } = await pool.query('DELETE FROM email_verification_tokens WHERE token_hash = $1 AND expires_at > now() RETURNING user_id', [tokenHash])
  if (!rows[0]) return false
  await pool.query('UPDATE app_users SET email_verified_at = now(), updated_at = now() WHERE id = $1', [rows[0].user_id])
  return true
}
