

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Award, KeyRound, Briefcase, MinusCircle, AlertCircle, Code, UserCog, PenTool, GraduationCap, ArrowUpRight, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { getServerColor } from '@/lib/color-utils';

type Server = {
  id: string;
  initials: string;
  nomeCompleto: string;
  emailInstitucional: string;
  status: string;
  rating: number;
  funcao: string;
  telefonePrincipal: string;
  avatarUrl?: string;
};

export function ServerList() {
    const isMobile = useIsMobile();
    const router = useRouter();
    const firestore = useFirestore();
    const [serversWithRatings, setServersWithRatings] = useState<any[]>([]);

    const serversQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'servers');
    }, [firestore]);

    const { data: servers, isLoading } = useCollection<any>(serversQuery);

    const sortedServers = useMemo(() => {
        if (!servers) return [];
        return [...servers].sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));
    }, [servers]);

    useEffect(() => {
      const calculateRatings = async () => {
        if (!sortedServers || !firestore) return;
        
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const serversData = await Promise.all(
          sortedServers.map(async (server) => {
            const faltasQuery = query(collection(firestore, 'servers', server.id, 'faltas'));
            const licencasQuery = query(collection(firestore, 'servers', server.id, 'licencas'));

            const [faltasSnapshot, licencasSnapshot] = await Promise.all([
                getDocs(faltasQuery),
                getDocs(licencasQuery),
            ]);

            const faltasThisMonth = faltasSnapshot.docs.filter(doc => {
                const data = doc.data();
                const [, month, year] = data.date.split('/');
                return parseInt(month, 10) === currentMonth && parseInt(year, 10) === currentYear;
            }).length;

            const licencasThisMonth = licencasSnapshot.docs.filter(doc => {
                const data = doc.data();
                const [, month, year] = data.startDate.split('/');
                return parseInt(month, 10) === currentMonth && parseInt(year, 10) === currentYear;
            }).length;

            const calculatedRating = 10 - (faltasThisMonth * 1) - (licencasThisMonth * 0.5);
            return { ...server, calculatedRating };
          })
        );
        
        const recentServers = serversData
            .sort((a, b) => (b.id ?? '').localeCompare(a.id ?? '')) // To get recent ones, assuming higher ID is newer
            .slice(0, 5);
            
        setServersWithRatings(recentServers);
      };

      calculateRatings();
    }, [sortedServers, firestore]);

    const getRatingClass = (rating: number) => {
        if (rating >= 8) return 'text-green-500';
        if (rating >= 4) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getStatusClass = (status: string) => {
      if (status === 'Ativo') return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300 border-green-500/50';
      if (status === 'Licença') return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border-yellow-500/50';
      return 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border-red-500/50';
    };

    const getStatusIcon = (status: string) => {
      if (status === 'Ativo') return <CheckCircle className="w-3 h-3 mr-1" />;
      if (status === 'Licença') return <AlertCircle className="w-3 h-3 mr-1" />;
      return <MinusCircle className="w-3 h-3 mr-1" />;
    }

    const formatWhatsAppLink = (phone: string) => {
      if (!phone) return '';
      const justNumbers = phone.replace(/\D/g, '');
      return `https://wa.me/55${justNumbers}`;
    }

    const getFuncaoIcon = (funcao: string) => {
      switch (funcao) {
        case 'Gerente de Projetos':
          return <UserCog className="h-4 w-4" />;
        case 'Desenvolvedor Frontend':
          return <Code className="h-4 w-4" />;
        case 'Desenvolvedor Backend':
          return <Code className="h-4 w-4" />;
        case 'Designer UI/UX':
          return <PenTool className="h-4 w-4" />;
        case 'Estagiário':
          return <GraduationCap className="h-4 w-4" />;
        default:
          return <Briefcase className="h-4 w-4" />;
      }
    };


  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="md:text-3xl">Servidores Recentes</CardTitle>
        <CardDescription className="md:text-base">
          Uma lista das últimas adições à sua equipe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <p className="text-center">Carregando...</p>
        ) : isMobile ? (
             <div className="space-y-4">
                {serversWithRatings.map((server) => {
                  const originalIndex = sortedServers.findIndex(s => s.id === server.id);
                  const colorClass = getServerColor(server, originalIndex);
                  return (
                    <Card
                      key={server.id}
                      className={cn("cursor-pointer", colorClass)}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('a')) {
                          return;
                        }
                        router.push(`/servidores/${server.id}?color=${encodeURIComponent(colorClass)}`);
                      }}
                    >
                      <CardContent className="flex items-start gap-4 p-4">
                        <div className="flex flex-col items-center gap-2">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={server.avatarUrl} />
                            <AvatarFallback className="text-lg">{server.initials}</AvatarFallback>
                          </Avatar>
                           <div className="flex flex-col items-center gap-1">
                            {server.status && (
                              <Badge variant="outline" className={cn("text-xs", getStatusClass(server.status))}>
                                {getStatusIcon(server.status)}
                                {server.status}
                              </Badge>
                            )}
                            <div className={cn("flex items-center text-xs font-semibold", getRatingClass(server.calculatedRating))}>
                                <Award className="w-3 h-3 mr-1 fill-current" />
                                <span>Nota: {server.calculatedRating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-semibold whitespace-nowrap">{server.nomeCompleto}</p>
                          <p className="text-sm">{server.emailInstitucional}</p>
                           {server.funcao && (
                            <div className="flex items-center gap-2 text-sm">
                              {getFuncaoIcon(server.funcao)}
                              <span>{server.funcao}</span>
                            </div>
                          )}
                          {server.telefonePrincipal && (
                            <a href={formatWhatsAppLink(server.telefonePrincipal)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 pt-1 text-base">
                              <WhatsAppIcon className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-blue-500">{server.telefonePrincipal}</span>
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
        ) : (
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[350px]">Servidor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead className="text-right pr-4">Telefone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serversWithRatings.map((server) => {
                     const originalIndex = sortedServers.findIndex(s => s.id === server.id);
                     const colorClass = getServerColor(server, originalIndex);
                    return (
                    <TableRow
                      key={server.id}
                      className={cn("cursor-pointer", colorClass)}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('a')) {
                          return;
                        }
                        router.push(`/servidores/${server.id}?color=${encodeURIComponent(colorClass)}`);
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={server.avatarUrl} />
                                <AvatarFallback className="text-lg">{server.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{server.nomeCompleto}</p>
                                <p className="text-sm">{server.emailInstitucional}</p>
                            </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge variant="outline" className={cn(getStatusClass(server.status))}>
                            {getStatusIcon(server.status)}
                            {server.status}
                          </Badge>
                      </TableCell>
                      <TableCell>
                         <div className={cn("flex items-center font-semibold", getRatingClass(server.calculatedRating))}>
                            <Award className="w-3 h-3 mr-1 fill-current" />
                            <span>{server.calculatedRating.toFixed(1)}</span>
                          </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                           {getFuncaoIcon(server.funcao)}
                          <span>{server.funcao}</span>
                        </div>
                      </TableCell>
                       <TableCell className="text-right pr-4 whitespace-nowrap">
                         <a href={formatWhatsAppLink(server.telefonePrincipal)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base justify-end">
                            <WhatsAppIcon className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-blue-500">{server.telefonePrincipal}</span>
                        </a>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
        )}
      </CardContent>
       <CardFooter className="pt-6">
        <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          <Link href="/servidores">
            Ver todos
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
