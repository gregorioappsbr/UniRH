
'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { BottomNav } from './bottom-nav';
import { ScrollText } from 'lucide-react';

const publicPaths = ['/login', '/signup', '/servidores/cadastro'];

// This component contains the main layout of the app with the bottom nav
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <main className="flex-1 pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  useEffect(() => {
    if (!isUserLoading) {
      if (!user && !isPublicPath) {
        router.push('/login');
      }
    }
  }, [user, isUserLoading, router, pathname, isPublicPath]);

  if (isUserLoading && !isPublicPath) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <ScrollText className="h-16 w-16 text-primary animate-spin" />
            </div>
        </div>
    );
  }
  
    if (!user && !isPublicPath) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p>Redirecionando para o login...</p>
                </div>
            </div>
        );
    }

  if (isPublicPath) {
    return <>{children}</>;
  }

  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}
