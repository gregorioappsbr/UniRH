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
import { Phone, Medal, KeyRound, Briefcase } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';


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
        if (rating >= 8) return 'text-green-400';
        if (rating >= 4) return 'text-yellow-400';
        return 'text-red-400';
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
                        <Badge variant="outline" className={cn("text-xs", server.status === 'Ativo' ? "text-green-400 border-green-400" : "text-yellow-400 border-yellow-400")}>
                          {server.status === 'Ativo' ? <KeyRound className="w-3 h-3 mr-1" /> : <Medal className="w-3 h-3 mr-1" />}
                          {server.status}
                        </Badge>
                      )}
                      {server.rating && (
                        <div className={cn("flex items-center text-muted-foreground text-xs", getRatingClass(server.rating))}>
                          <Medal className="w-3 h-3 mr-1 fill-current" />
                          <span>Nota: {server.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{server.name}</p>
                      <p className="text-sm text-muted-foreground">{server.email}</p>
                      {server.phone && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{server.phone}</span>
                        </div>
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
                         <Badge variant="outline" className={cn(server.status === 'Ativo' ? "text-green-400 border-green-400" : "text-yellow-400 border-yellow-400")}>
                            {server.status === 'Ativo' ? <KeyRound className="w-3 h-3 mr-1" /> : <Medal className="w-3 h-3 mr-1" />}
                            {server.status}
                          </Badge>
                      </TableCell>
                      <TableCell>
                         <div className={cn("flex items-center", getRatingClass(server.rating))}>
                            <Medal className="w-3 h-3 mr-1 fill-current" />
                            <span>{server.rating}</span>
                          </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span>{server.funcao}</span>
                        </div>
                      </TableCell>
                       <TableCell>
                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{server.phone}</span>
                        </div>
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
