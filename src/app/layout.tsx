import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ArtistsProvider } from '../context/ArtistsContext';
import Navbar from '../components/Navbar';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Galerie Joséphine",
  description: "Une galerie d'art locale pour explorer vos collections d'œuvres",
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/logo.jpeg" />
      </head>
      <body className={inter.className}>
        <ArtistsProvider>
          <Navbar />
          {children}
        </ArtistsProvider>
      </body>
    </html>
  );
}
