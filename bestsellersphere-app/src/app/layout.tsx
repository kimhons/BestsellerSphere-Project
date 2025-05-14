import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BestsellerSphere - Your Guide to Self-Publishing",
  description: "Navigate self-publishing with ease. Get tailored guidelines and resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="py-4 px-4 md:px-12 lg:px-24 bg-slate-900 text-white shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold hover:text-slate-300">
              BestsellerSphere
            </Link>
            <div className="space-x-4">
              <Link href="/" className="hover:text-slate-300">
                Home (Guideline Tool)
              </Link>
              <Link href="/about" className="hover:text-slate-300">
                About Us
              </Link>
              {/* Placeholder for future links */}
              {/* <Link href="/platforms" className="hover:text-slate-300">Platforms</Link> */}
              {/* <Link href="/resources" className="hover:text-slate-300">Resources</Link> */}
            </div>
          </nav>
        </header>
        {children}
        <footer className="py-6 px-4 md:px-12 lg:px-24 bg-slate-900 text-white text-center mt-12">
          <p>&copy; {new Date().getFullYear()} BestsellerSphere.com. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}

