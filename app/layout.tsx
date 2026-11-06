import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { WatchlistProvider } from '@/contexts/WatchlistContext';

export const metadata: Metadata = {
  title: 'يمن فلکس - سينما وأفلام ومسلسلات عربية وعالمية',
  description: 'منصة يمن فلکس لمشاهدة وتحميل أحدث الأفلام والمسلسلات العربية والتركية والأجنبية والأنمي بجودة عالية وسيرفرات مباشرة بدون إعلانات مزعجة.',
  openGraph: {
    title: 'يمن فلکس - سينما وأفلام ومسلسلات عربية وعالمية',
    description: 'منصة يمن فلکس لمشاهدة وتحميل أحدث الأفلام والمسلسلات العربية والتركية والأجنبية والأنمي بجودة عالية وسيرفرات مباشرة.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                var msg = e && (e.message || (e.error && e.error.message)) || '';
                if (msg.indexOf('Loading chunk') !== -1 || msg.indexOf('ChunkLoadError') !== -1 || msg.indexOf('Unexpected token') !== -1) {
                  if (!window.__chunkReloaded) {
                    window.__chunkReloaded = true;
                    console.warn('[Auto-Recovery] Reloading on chunk error:', msg);
                    window.location.reload();
                  }
                }
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#0B0F19] text-zinc-100 flex flex-col antialiased selection:bg-amber-500 selection:text-black">
        <AuthProvider>
          <WatchlistProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </WatchlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
