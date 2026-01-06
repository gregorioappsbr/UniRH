
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Mail, Phone, Type, Building, Edit, Trash2, Star, CheckCircle, User, Heart, Home, Briefcase, GraduationCap, Info } from 'lucide-react';
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

  const fichaItems = [
    { icon: User, label: "Dados Pessoais", content: "Conteúdo de Dados Pessoais." },
    { icon: Phone, label: "Contato", content: "Conteúdo de Contato." },
    { icon: Heart, label: "Contato de Emergência", content: "Conteúdo de Contato de Emergência." },
    { icon: Home, label: "Endereço", content: "Conteúdo de Endereço." },
    { icon: Briefcase, label: "Dados Profissionais", content: "Conteúdo de Dados Profissionais." },
    { icon: GraduationCap, label: "Formação", content: "Conteúdo de Formação." },
    { icon: Info, label: "Observações", content: "Conteúdo de Observações." },
  ];

  return (
    <div className="p-4 space-y-4 flex flex-col flex-1 h-full">
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
      
      <Tabs defaultValue="ficha" className="w-full flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ficha">Ficha</TabsTrigger>
          <TabsTrigger value="faltas">Faltas</TabsTrigger>
          <TabsTrigger value="licencas">Licenças</TabsTrigger>
          <TabsTrigger value="ferias">Férias</TabsTrigger>
        </TabsList>
        <TabsContent value="ficha" className="mt-4 flex-1 flex flex-col">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {fichaItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border-none rounded-lg">
                <AccordionTrigger className="p-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <p className="text-muted-foreground">{item.content}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-auto pt-4">
            <Button className="w-full">Salvar Alterações</Button>
          </div>
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
