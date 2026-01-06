
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Mail, Phone, Type, Building, Edit, Trash2, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ServerProfilePage() {
  const server = {
    initials: 'LTC',
    name: 'Lilian Tenório Carvalho',
    role: 'ATNM',
    status: 'Ativo',
    rating: 10.0,
    email: 'litencarv@uems.br',
    phone: '(67) 98167-2870',
    type: 'Efetivo',
    department: 'Secretaria da Gerência',
  };

  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/servidores">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Voltar</h1>
      </header>

      <Card className="bg-card text-card-foreground">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-4xl">
                {server.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{server.name}</h2>
              <p className="text-muted-foreground">{server.role}</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                <CheckCircle className="h-3 w-3 mr-1" />
                {server.status}
              </Badge>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                <Star className="h-3 w-3 mr-1" />
                Nota: {server.rating.toFixed(1)}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{server.email}</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{server.phone}</span>
            </div>
            <div className="flex items-center gap-4">
              <Type className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{server.type}</span>
            </div>
            <div className="flex items-center gap-4">
              <Building className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{server.department}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="ficha" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ficha">Ficha</TabsTrigger>
          <TabsTrigger value="faltas">Faltas</TabsTrigger>
          <TabsTrigger value="licencas">Licenças</TabsTrigger>
          <TabsTrigger value="ferias">Férias</TabsTrigger>
        </TabsList>
        <TabsContent value="ficha" className="mt-4">
          <p className="text-center text-muted-foreground">Conteúdo da Ficha.</p>
        </TabsContent>
        <TabsContent value="faltas" className="mt-4">
          <p className="text-center text-muted-foreground">Conteúdo de Faltas.</p>
        </TabsContent>
        <TabsContent value="licencas" className="mt-4">
          <p className="text-center text-muted-foreground">Conteúdo de Licenças.</p>
        </TabsContent>
        <TabsContent value="ferias" className="mt-4">
          <p className="text-center text-muted-foreground">Conteúdo de Férias.</p>
        </TabsContent>
      </Tabs>

    </div>
  );
}
