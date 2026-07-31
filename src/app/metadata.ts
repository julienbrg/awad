import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://awad.w3hc.org'),

  title: 'AWAD',
  description: 'A word a day',

  keywords: ['AWAD', 'w3pk', 'WebAuthn', 'Next.js', 'Web3', 'Ethereum'],
  authors: [{ name: 'Julien Béranger', url: 'https://github.com/julienbrg' }],

  openGraph: {
    title: 'AWAD',
    description: 'A word a day',
    siteName: 'AWAD',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'A word a day',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'AWAD',
    description: 'A word a day',
    images: ['/huangshan.png'],
    creator: '@julienbrg',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'your-google-site-verification',
  },
}
