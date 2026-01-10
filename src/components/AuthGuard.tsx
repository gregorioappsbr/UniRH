
'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { BottomNav } from './bottom-nav';
import { ScrollText } from 'lucide-react';

const publicPaths = ['/login', '/signup', '/pre-cadastro'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  useEffect(() => {
    if (!isUserLoading) {
      if (!user && !isPublicPath) {
        router.push('/login');
      } else if (user && pathname === '/login') { // Only redirect from /login if logged in
        router.push('/');
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
    
    if (user && pathname === '/login') {
        return null; // Don't render anything while redirecting
    }

  return (
    <>
      {children}
    </>
  );
}
