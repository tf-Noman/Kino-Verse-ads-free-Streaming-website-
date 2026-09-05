import type { Metadata, Viewport } from 'next';
import './globals.css';
import { WatchlistProvider } from '@/lib/watchlist-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'KinoVerse — Watch Free Movies & TV Shows Online',
  description: 'Discover and watch thousands of movies, TV shows, anime and Hindi dubbed content for free. KinoVerse does not host any media files.',
  keywords: ['movies', 'tv shows', 'watch free', 'hindi dubbed', 'anime', 'kinoverse', 'streaming index'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#09090b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-brand-red selection:text-white">
        <WatchlistProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </WatchlistProvider>
      </body>
    </html>
  );
}
