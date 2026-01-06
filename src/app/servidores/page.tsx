'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, PlusCircle, Filter, Award, MinusCircle, AlertCircle, Briefcase, Code, PenTool, GraduationCap, UserCog, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { useIsMobile } from '@/hooks/use-mobile';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';

const servers = [
  {
    initials: 'AMS',
    name: 'Ana Maria da Silva e Souza',
    email: 'ana.silva@exemplo.com',
    status: 'Ativo',
    rating: 9.5,
    phone: '(67) 99999-1234',
    funcao: 'Gerente de Projetos',
    vinculo: 'Efetivo',
  },
  {
    initials: 'BC',
    name: 'Bruno Costa',
    email: 'bruno.costa@exemplo.com',
    status: 'Ativo',
    rating: 8.0,
    phone: '(67) 99999-5678',
    funcao: 'Desenvolvedor Frontend',
    vinculo: 'Contratado',
  },
  {
    initials: 'CD',
    name: 'Carla Dias',
    email: 'carla.dias@exemplo.com',
    status: 'Licença',
    rating: 7.2,
    phone: '(67) 99999-4321',
    funcao: 'Designer UI/UX',
    vinculo: 'Terceirizado',
  },
    {
    initials: 'JD',
    name: 'João Dias',
    email: 'joao.dias@exemplo.com',
    status: 'Inativo',
    rating: 3.5,
    phone: '(67) 98888-4321',
    funcao: 'Estagiário',
    vinculo: 'Contratado',
  },
  {
    initials: 'LTC',
    name: 'Lilian Tenório Carvalho',
    email: 'litencarv@uems.br',
    status: 'Ativo',
    rating: 3.2,
    phone: '(67) 98167-2870',
    funcao: 'ATNM',
    vinculo: 'Efetivo',
  },
   {
    initials: 'FG',
    name: 'Fernando Gomes',
    email: 'fernando.gomes@exemplo.com',
    status: 'Ativo',
    rating: 8.8,
    phone: '(67) 98888-1111',
    funcao: 'Desenvolvedor Backend',
    vinculo: 'Comissionado',
  },
];

servers.sort((a, b) => a.name.localeCompare(b.name));

const statusOptions = ['Ativo', 'Inativo', 'Licença'];
const vinculoOptions = ['Efetivo', 'Terceirizado', 'Cedido', 'Contratado', 'Comissionado'];


export default function ServerListPage() {
  const isMobile = useIsMobile();
  const [selectedServers, setSelectedServers] = React.useState<Record<string, boolean>>({});
  
  const [statusFilters, setStatusFilters] = React.useState<string[]>([]);
  const [vinculoFilters, setVinculoFilters] = React.useState<string[]>([]);


  const handleSelectAll = (checked: boolean) => {
    const newSelectedServers: Record<string, boolean> = {};
    if (checked) {
      filteredServers.forEach(server => {
        newSelectedServers[server.email] = true;
      });
    }
    setSelectedServers(newSelectedServers);
  };

  const handleSelectServer = (email: string, checked: boolean) => {
    setSelectedServers(prev => ({
      ...prev,
      [email]: checked,
    }));
  };
  
  const handleStatusFilterChange = (status: string) => {
    setStatusFilters(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleVinculoFilterChange = (vinculo: string) => {
    setVinculoFilters(prev => 
      prev.includes(vinculo) ? prev.filter(v => v !== vinculo) : [...prev, vinculo]
    );
  };

  const clearFilters = () => {
    setStatusFilters([]);
    setVinculoFilters([]);
  };

  const filteredServers = servers.filter(server => {
    const statusMatch = statusFilters.length === 0 || statusFilters.includes(server.status);
    const vinculoMatch = vinculoFilters.length === 0 || vinculoFilters.includes(server.vinculo);
    return statusMatch && vinculoMatch;
  });


  const allSelected = filteredServers.length > 0 && Object.keys(selectedServers).length === filteredServers.length && Object.values(selectedServers).every(v => v);
  const someSelected = Object.keys(selectedServers).length > 0 && !allSelected;


  const getRatingClass = (rating: number) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 4) return 'text-yellow-400';
    return 'text-red-400';
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
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtrar Servidores</SheetTitle>
              <SheetDescription>
                Refine sua busca por status ou tipo de vínculo.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Status</h4>
                <div className="space-y-2">
                  {statusOptions.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`filter-status-${status}`} 
                        checked={statusFilters.includes(status)}
                        onCheckedChange={() => handleStatusFilterChange(status)}
                      />
                      <Label htmlFor={`filter-status-${status}`} className="font-normal text-base">{status}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Vínculo</h4>
                 <div className="space-y-2">
                  {vinculoOptions.map(vinculo => (
                    <div key={vinculo} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`filter-vinculo-${vinculo}`} 
                        checked={vinculoFilters.includes(vinculo)}
                        onCheckedChange={() => handleVinculoFilterChange(vinculo)}
                      />
                      <Label htmlFor={`filter-vinculo-${vinculo}`} className="font-normal text-base">{vinculo}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={clearFilters}>Limpar Filtros</Button>
              <SheetClose asChild>
                <Button>Aplicar</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
          Partilhar Formulário
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isMobile ? (
            <>
              <div className="flex items-center p-4 border-b">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  aria-label="Selecionar todos"
                />
                <label htmlFor="select-all" className="ml-4 font-medium text-sm">
                  Nome
                </label>
              </div>
              <div className="space-y-4 p-4">
                {filteredServers.map((server) => (
                  <div key={server.email} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                    <Checkbox
                      id={`server-${server.email}`}
                      checked={selectedServers[server.email] || false}
                      onCheckedChange={(checked) => handleSelectServer(server.email, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <Link href={`/servidores/${server.email.split('@')[0]}`}>
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-lg">{server.initials}</AvatarFallback>
                        </Avatar>
                      </Link>
                       <div className="flex flex-col items-center gap-1">
                        {server.status && (
                          <Badge variant="outline" className={cn("text-xs", getStatusClass(server.status))}>
                            {getStatusIcon(server.status)}
                            {server.status}
                          </Badge>
                        )}
                        {server.rating && (
                          <div className={cn("flex items-center text-xs", getRatingClass(server.rating))}>
                            <Award className="w-3 h-3 mr-1 fill-current" />
                            <span>Nota: {server.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Link href={`/servidores/${server.email.split('@')[0]}`}>
                        <p className="font-semibold">{server.name}</p>
                      </Link>
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
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[350px]">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          id="select-all-desktop"
                          checked={allSelected}
                          onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                          aria-label="Selecionar todos"
                        />
                        <span>Servidor</span>
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead className="text-right pr-8">Telefone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServers.map((server) => (
                    <TableRow key={server.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`server-desktop-${server.email}`}
                            checked={selectedServers[server.email] || false}
                            onCheckedChange={(checked) => handleSelectServer(server.email, checked as boolean)}
                          />
                          <Link href={`/servidores/${server.email.split('@')[0]}`} className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                  <AvatarFallback className="text-lg">{server.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                  <p className="font-semibold">{server.name}</p>
                                  <p className="text-sm text-muted-foreground break-all">{server.email}</p>
                              </div>
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className={cn("w-fit", getStatusClass(server.status))}>
                              {getStatusIcon(server.status)}
                              {server.status}
                          </Badge>
                           <div className={cn("flex items-center text-xs", getRatingClass(server.rating))}>
                              <Award className="w-3 h-3 mr-1 fill-current" />
                              <span>Nota: {server.rating}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           {getFuncaoIcon(server.funcao)}
                          <span>{server.funcao}</span>
                        </div>
                      </TableCell>
                       <TableCell className="text-right pr-8 whitespace-nowrap">
                         <a href={formatWhatsAppLink(server.phone)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base text-foreground hover:text-primary justify-end">
                            <WhatsAppIcon className="h-4 w-4" />
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
    </div>
  );
}
