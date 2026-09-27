import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'ASSAR École de santé | Formations vidéo', description: 'Formations vidéo accessibles pour mieux comprendre, prévenir et agir pour la santé communautaire.', icons: { icon: '/assar-logo.png' } }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html> }
