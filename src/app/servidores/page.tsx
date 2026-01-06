'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, PlusCircle, Filter, Share2, KeyRound, Award, MinusCircle, AlertCircle, Briefcase, Code, PenTool, GraduationCap, UserCog } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

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
  {
    initials: 'CD',
    name: 'Carla Dias',
    email: 'carla.dias@exemplo.com',
    status: 'Licença',
    rating: 7.2,
    phone: '(67) 99999-4321',
    funcao: 'Designer UI/UX',
  },
    {
    initials: 'JD',
    name: 'João Dias',
    email: 'joao.dias@exemplo.com',
    status: 'Inativo',
    rating: 3.5,
    phone: '(67) 98888-4321',
    funcao: 'Estagiário',
  },
];

export default function ServerListPage() {

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
    <div className="p-4 space-y-4">
      <header className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">LISTA DE SERVIDORES</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Gerencie os dados e o histórico de todos os servidores.
        </p>
      </header>

      <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white">
        <Link href="/servidores/novo">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Novo Servidor
        </Link>
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
          Partilhar Formulário
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center p-4 border-b">
            <Checkbox id="select-all" />
            <label htmlFor="select-all" className="ml-4 font-medium text-sm">
              Nome
            </label>
          </div>
          <div className="space-y-4 p-4">
            {servers.map((server, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                <Checkbox id={`server-${index}`} className="mt-1" />
                <Avatar>
                  <AvatarFallback>{server.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
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
                      <WhatsAppIcon className="h-4 w-4" />
                      <span>{server.phone}</span>
                    </a>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-xs">
                    {server.status && (
                       <Badge variant="outline" className={cn(getStatusClass(server.status))}>
                        {getStatusIcon(server.status)}
                        {server.status}
                      </Badge>
                    )}
                    {server.rating && (
                      <div className={cn("flex items-center text-muted-foreground", getRatingClass(server.rating))}>
                        <Award className="w-3 h-3 mr-1 fill-current" />
                        <span>Nota: {server.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
