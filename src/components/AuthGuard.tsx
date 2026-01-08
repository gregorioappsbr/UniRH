'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { BottomNav } from './bottom-nav';

const publicPaths = ['/login', '/signup'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading) {
      const isPublicPath = publicPaths.includes(pathname);

      if (!user && !isPublicPath) {
        router.push('/login');
      } else if (user && isPublicPath) {
        router.push('/');
      }
    }
  }, [user, isUserLoading, router, pathname]);

  if (isUserLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <p>Carregando...</p>
            </div>
        </div>
    );
  }
  
  const isPublic = publicPaths.includes(pathname);
    if (!user && !isPublic) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p>Redirecionando para o login...</p>
                </div>
            </div>
        );
    }
    
    if (user && isPublic) {
        return null; // Don't render anything while redirecting
    }

  return (
    <>
      {children}
      {!publicPaths.includes(pathname) && <BottomNav />}
    </>
  );
}
