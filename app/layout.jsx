import "./globals.css";
import AppShell from "@/components/common/AppShell";
import { SITE_URL, SITE_NAME, HOME_TITLE, HOME_DESCRIPTION } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { businessJsonLd, jsonLdString } from "@/lib/structured-data";

// Server component: εξάγει τα προεπιλεγμένα metadata (SSR) ώστε Google και
// social previews (Viber/WhatsApp/Facebook) να βλέπουν title, description και
// εικόνα χωρίς JavaScript. Κάθε route έχει δικό του layout.jsx με τα δικά του.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({ description: HOME_DESCRIPTION, path: "/" }),
  title: { default: HOME_TITLE, template: `%s | ${SITE_NAME}` },
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  icons: {
    icon: [{ url: "/images/logo-32.png", sizes: "32x32", type: "image/png" }],
    apple: "/images/logo-192.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00513e",
};

export default function RootLayout({ children }) {
  return (
    <html lang="el" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <script
          id="ld-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(businessJsonLd("el")) }}
        />
      </head>

      <body className="min-h-screen flex flex-col bg-surface text-paper antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
