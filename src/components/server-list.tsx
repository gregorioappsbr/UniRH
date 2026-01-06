'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Award, KeyRound, Briefcase, MinusCircle, AlertCircle, Code, UserCog, PenTool, GraduationCap } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import Link from 'next/link';


const servers = [
  {
    initials: 'AMS',
    name: 'Ana Maria da Silva e Souza',
    email: 'ana.silva@exemplo.com',
    status: 'Ativo',
    rating: 9.5,
    phone: '(67) 99999-1234',
    funcao: 'Gerente de Projetos',
  },
  {
    initials: 'BC',
    name: 'Bruno Costa',
    email: 'bruno.costa@exemplo.com',
    status: 'Ativo',
    rating: 8.0,
    phone: '(67) 99999-5678',
    funcao: 'Desenvolvedor Frontend',
  },
];

export function ServerList() {
    const isMobile = useIsMobile();

    const getRatingClass = (rating: number) => {
        if (rating >= 8) return 'text-green-400 border-green-400';
        if (rating >= 4) return 'text-yellow-400 border-yellow-400';
        return 'text-red-400 border-red-400';
    };

    const getStatusClass = (status: string) => {
      if (status === 'Ativo') return 'bg-green-500/20 text-green-400 border-green-500/50';
      if (status === 'Licença') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      return 'bg-red-500/20 text-red-400 border-red-500/50';
    };

    const getStatusIcon = (status: string) => {
      if (status === 'Ativo') return <KeyRound className="w-3 h-3 mr-1" />;
      if (status === 'Licença') return <AlertCircle className="w-3 h-3 mr-1" />;
      return <MinusCircle className="w-3 h-3 mr-1" />;
    }

    const formatWhatsAppLink = (phone: string) => {
      const justNumbers = phone.replace(/\D/g, '');
      return `https://wa.me/55${justNumbers}`;
    }

    const getFuncaoIcon = (funcao: string) => {
      switch (funcao) {
        case 'Gerente de Projetos':
          return <UserCog className="h-4 w-4" />;
        case 'Desenvolvedor Frontend':
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
    <Card className="bg-card">
      <CardHeader className="text-center">
        <CardTitle className="md:text-3xl">Servidores Recentes</CardTitle>
        <CardDescription className="md:text-base">
          Uma lista das últimas adições à sua equipe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isMobile ? (
             <div className="space-y-4">
                {servers.map((server, index) => (
                  <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar>
                        <AvatarFallback>{server.initials}</AvatarFallback>
                      </Avatar>
                      {server.status && (
                        <Badge variant="outline" className={cn("text-xs", getStatusClass(server.status))}>
                          {getStatusIcon(server.status)}
                          {server.status}
                        </Badge>
                      )}
                      {server.rating && (
                        <div className={cn("flex items-center text-muted-foreground text-xs", getRatingClass(server.rating))}>
                          <Award className="w-3 h-3 mr-1 fill-current" />
                          <span>Nota: {server.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="font-semibold">{server.name}</p>
                      <p className="text-sm text-muted-foreground">{server.email}</p>
                      {server.funcao && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {getFuncaoIcon(server.funcao)}
                          <span>{server.funcao}</span>
                        </div>
                      )}
                      {server.phone && (
                        <a href={formatWhatsAppLink(server.phone)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 pt-1 text-base text-foreground hover:text-primary">
                          <Phone className="h-4 w-4" />
                          <span>{server.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
        ) : (
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servidor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Contato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers.map((server, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>{server.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{server.name}</p>
                                <p className="text-sm text-muted-foreground">{server.email}</p>
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
                         <div className={cn("flex items-center", getRatingClass(server.rating))}>
                            <Award className="w-3 h-3 mr-1 fill-current" />
                            <span>{server.rating}</span>
                          </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           {getFuncaoIcon(server.funcao)}
                          <span>{server.funcao}</span>
                        </div>
                      </TableCell>
                       <TableCell className="whitespace-nowrap">
                         <a href={formatWhatsAppLink(server.phone)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base text-foreground hover:text-primary">
                            <Phone className="h-4 w-4" />
                            <span>{server.phone}</span>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
        )}
      </CardContent>
    </Card>
  );
}
