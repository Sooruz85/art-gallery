import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ArtistsProvider } from '../context/ArtistsContext';
import NavbarSimple from '../components/NavbarSimple';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Galerie d'Art Locale",
  description: "Une galerie d'art locale pour explorer vos collections d'œuvres",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ArtistsProvider>
          <NavbarSimple />
          {children}
        </ArtistsProvider>
      </body>
    </html>
  );
}
