'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, PlusCircle, Filter, Share2, KeyRound, Award, Star, Phone } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const servers = [
  {
    initials: 'AMS',
    name: 'Ana Maria da Silva e Souza',
    email: 'ana.silva@exemplo.com',
    status: 'Ativo',
    rating: 9.5,
    phone: '(67) 99999-1234',
  },
  {
    initials: 'BC',
    name: 'Bruno Costa',
    email: 'bruno.costa@exemplo.com',
    status: 'Ativo',
    rating: 8.0,
    phone: '(67) 99999-5678',
  },
  {
    initials: 'CD',
    name: 'Carla Dias',
    email: 'carla.dias@exemplo.com',
    status: 'Licença',
    rating: 7.2,
    phone: '(67) 99999-4321',
  },
    {
    initials: 'JD',
    name: 'João Dias',
    email: 'joao.dias@exemplo.com',
    status: 'Férias',
    rating: 3.5,
    phone: '(67) 98888-4321',
  },
];

export default function ServerListPage() {

  const getRatingClass = (rating: number) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 4) return 'text-yellow-400';
    return 'text-red-400';
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
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    {server.status && (
                       <Badge variant="outline" className={server.status === 'Ativo' ? "text-green-400 border-green-400" : "text-yellow-400 border-yellow-400"}>
                        {server.status === 'Ativo' ? <KeyRound className="w-3 h-3 mr-1" /> : <Award className="w-3 h-3 mr-1" />}
                        {server.status}
                      </Badge>
                    )}
                    {server.rating && (
                      <div className={cn("flex items-center text-muted-foreground", getRatingClass(server.rating))}>
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        <span>Nota: {server.rating}</span>
                      </div>
                    )}
                  </div>
                   {server.phone && (
                    <div className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{server.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
