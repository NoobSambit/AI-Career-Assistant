import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BRAND_NAME, TAGLINE } from '@/lib/brand'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${BRAND_NAME} | ${TAGLINE}`,
  description: 'Upload your resume or a screenshot. Get a recruiter‑ready version with measurable ATS gains. Resume Booster, Interview Coach, and Email Rewriter powered by AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>{children}</body>
    </html>
  )
}