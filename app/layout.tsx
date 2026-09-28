import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'ASSAR | Formations vidéo IA créative', description: 'Formations vidéo courtes et pratiques pour apprendre à créer des vidéos avec l’intelligence artificielle, de A à Z.', icons: { icon: '/assar-logo.png' } }

import { AppSessionProvider } from '@/components/session-provider'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body><AppSessionProvider>{children}</AppSessionProvider></body></html> }
