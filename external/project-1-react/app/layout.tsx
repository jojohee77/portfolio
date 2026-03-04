import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "AgOffice - 마케팅 관리 플랫폼",
  description: "계약부터 키워드 성과까지, AI 마케팅 통합 솔루션",
  generator: "v0.app",
  openGraph: {
    title: "AgOffice - 마케팅 관리 플랫폼",
    description: "계약부터 키워드 성과까지, AI 마케팅 통합 솔루션",
    images: [
      {
        url: "/share-img.jpg",
        width: 1200,
        height: 630,
        alt: "Ag Office",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/favicons/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/favicons/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/favicons/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/favicons/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/favicons/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/favicons/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/favicons/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/favicons/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/favicons/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "apple-touch-icon-precomposed", url: "/favicons/apple-icon-precomposed.png" },
    ],
  },
  manifest: "/favicons/manifest.json",
  other: {
    "msapplication-TileColor": "#ffffff",
    "msapplication-TileImage": "/favicons/ms-icon-144x144.png",
    "msapplication-config": "/favicons/browserconfig.xml",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
        <link rel="icon" type="image/x-icon" href="/favicons/favicon.ico" />
      </head>
      <body className="font-pretendard antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
