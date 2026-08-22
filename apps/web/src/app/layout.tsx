import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@repo/ui/globals.css";
import GlobalProvider from "@/components/global.provider";

const font = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Meetstack — Instant Video Meetings Without Friction",
  description:
    "Launch crystal-clear HD video meetings in seconds with zero downloads, no mandatory accounts for guests, 4K screen sharing, and end-to-end encryption.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/images/meetstack-icon.jpg" }],
  },
  openGraph: {
    title: "Meetstack — Instant Video Meetings Without Friction",
    description:
      "Launch crystal-clear HD video meetings in seconds with zero downloads, no mandatory accounts for guests, 4K screen sharing, and end-to-end encryption.",
    url: "https://meetstack.live",
    siteName: "Meetstack",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Meetstack — Instant Video Meetings Without Friction",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meetstack — Instant Video Meetings Without Friction",
    description:
      "Launch crystal-clear HD video meetings in seconds with zero downloads, no mandatory accounts for guests, 4K screen sharing, and end-to-end encryption.",
    images: ["/images/og-image.jpg"],
    creator: "@meetstack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.variable}`}>
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
