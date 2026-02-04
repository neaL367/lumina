import "./globals.css";
import { Geist } from "next/font/google";
import { baseUrl } from "@/utils/constants";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
  preload: true,
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Neal367's photos",
  description: "a collection of my favorite memories.❣️",
  openGraph: {
    title: "Neal367's photos",
    description: "a collection of my favorite memories.❣️",
    url: baseUrl,
    siteName: "Neal367's photos",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Neal367's photos",
    description: "a collection of my favorite memories.❣️",
    creator: "@NL367",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        {props.children}
        {props.modal}
      </body>
    </html>
  );
}
