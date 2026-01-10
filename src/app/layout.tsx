
'use client';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AuthGuard } from '@/components/AuthGuard';
import { useEffect } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';

// export const metadata: Metadata = {
//   title: 'UniRH',
//   description: 'Gestão de Recursos Humanos',
// };

function AppContent({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const pathname = usePathname();
    const publicPaths = ['/login', '/signup', '/pre-cadastro'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    return (
        <>
            <div className="relative flex flex-col min-h-screen">
                <main className="flex-1 pb-20">
                    {children}
                </main>
            </div>
            {!isPublicPath && user && <BottomNav />}
        </>
    )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, []);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
       <head>
        <title>UniRH</title>
        <meta name="description" content="Gestão de Recursos Humanos" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <FirebaseClientProvider>
            <AuthGuard>
              <AppContent>
                {children}
              </AppContent>
            </AuthGuard>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
