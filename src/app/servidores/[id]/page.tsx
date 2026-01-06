

'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Mail, Type, Building, Edit, Trash2, Award, CheckCircle, User, Heart, Home, Briefcase, GraduationCap, Info, CalendarX, PlusCircle, MoreHorizontal, KeyRound, AlertCircle, MinusCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define a type for the server data
type Server = {
    initials: string;
    nomeCompleto: string;
    cargo: string;
    status: string;
    rating: number;
    emailInstitucional: string;
    telefonePrincipal: string;
    vinculo: string;
    setor: string;
    nomeSocial?: string;
    cpf?: string;
    rg?: string;
    orgaoEmissor?: string;
    dataNascimento?: string;
    genero?: string;
    corRaca?: string;
    estadoCivil?: string;
    nacionalidade?: string;
    naturalidade?: string;
    isPCD?: string;
    pcdDescricao?: string;
    nomeMae?: string;
    nomePai?: string;
    telefoneSecundario?: string;
    emailPessoal?: string;
    contatoEmergenciaNome?: string;
    contatoEmergenciaTelefone?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    funcao?: string;
    dataInicio?: string;
    jornada?: string;
    turno?: string;
    observacoes?: string;
};


export default function ServerProfilePage() {
    const params = useParams();
    const { id } = params;
    const [server, setServer] = useState<Server | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const storedServers = localStorage.getItem('servers');
            if (storedServers) {
                const servers = JSON.parse(storedServers);
                const foundServer = servers.find((s: any) => s.emailInstitucional.split('@')[0] === id);
                setServer(foundServer);
            }
        }
        setLoading(false);
    }, [id]);

  const fichaItems = [
    { icon: User, label: "Dados Pessoais", content: server ? `Nome Social: ${server.nomeSocial || ''}\nCPF: ${server.cpf || ''}\nRG: ${server.rg || ''}\nÓrgão Emissor: ${server.orgaoEmissor || ''}\nData de Nascimento: ${server.dataNascimento || ''}\nGênero: ${server.genero || ''}\nCor/Raça: ${server.corRaca || ''}\nEstado Civil: ${server.estadoCivil || ''}\nNacionalidade: ${server.nacionalidade || ''}\nNaturalidade: ${server.naturalidade || ''}\nPCD: ${server.isPCD === 'sim' ? `Sim - ${server.pcdDescricao}` : 'Não'}` : "" },
    { icon: WhatsAppIcon, label: "Contato", content: server ? `Telefone Principal: ${server.telefonePrincipal || ''}\nTelefone Secundário: ${server.telefoneSecundario || ''}\nEmail Pessoal: ${server.emailPessoal || ''}`: "" },
    { icon: Heart, label: "Contato de Emergência", content: server ? `Nome: ${server.contatoEmergenciaNome || ''}\nTelefone: ${server.contatoEmergenciaTelefone || ''}` : "" },
    { icon: Home, label: "Endereço", content: server ? `CEP: ${server.cep || ''}\nLogradouro: ${server.logradouro || ''}, Nº ${server.numero || ''}\nComplemento: ${server.complemento || ''}\nBairro: ${server.bairro || ''}\nCidade/UF: ${server.cidade || ''}/${server.uf || ''}`: "" },
    { icon: Briefcase, label: "Dados Profissionais", content: server ? `Função: ${server.funcao || ''}\nData de Início: ${server.dataInicio || ''}\nJornada: ${server.jornada || ''}\nTurno: ${server.turno || ''}` : "" },
    { icon: GraduationCap, label: "Formação", content: "Conteúdo de Formação." },
    { icon: Info, label: "Observações", content: server ? server.observacoes || 'Nenhuma observação.' : "" },
  ];

  const faltas = [
    {
      date: '19 de fevereiro de 2024',
      reason: 'Assuntos pessoais',
    }
  ];

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
    if (status === 'Ativo') return <CheckCircle className="h-3 w-3 mr-1" />;
    if (status === 'Licença') return <AlertCircle className="h-3 w-3 mr-1" />;
    return <MinusCircle className="h-3 w-3 mr-1" />;
  }

  const formatWhatsAppLink = (phone: string) => {
    if (!phone) return '';
    const justNumbers = phone.replace(/\D/g, '');
    return `https://wa.me/55${justNumbers}`;
  }

  if (loading) {
    return <div className="p-4 text-center">Carregando...</div>;
  }

  if (!server) {
    return <div className="p-4 text-center">Servidor não encontrado.</div>;
  }

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
              <h2 className="text-2xl font-bold">{server.nomeCompleto}</h2>
              <p className="text-muted-foreground">{server.cargo}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={cn(getStatusClass(server.status))}>
                {getStatusIcon(server.status)}
                {server.status}
              </Badge>
              <Badge variant="outline" className={cn(getRatingClass(server.rating))}>
                <Award className="h-3 w-3 mr-1" />
                Nota: {server.rating.toFixed(1)}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{server.emailInstitucional}</span>
            </div>
            <a href={formatWhatsAppLink(server.telefonePrincipal)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-base text-foreground hover:text-primary">
              <WhatsAppIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-base">{server.telefonePrincipal}</span>
            </a>
            <div className="flex items-center gap-4">
              <Type className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{server.vinculo}</span>
            </div>
            <div className="flex items-center gap-4">
              <Building className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{server.setor}</span>
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
        <div className="border dark:border-white/20 rounded-md">
          <TabsList className="h-auto items-center justify-center rounded-md p-1 flex flex-wrap w-full text-foreground bg-muted md:grid md:grid-cols-4">
            <TabsTrigger value="ficha" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Ficha</TabsTrigger>
            <TabsTrigger value="faltas" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Faltas</TabsTrigger>
            <TabsTrigger value="licencas" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Licenças</TabsTrigger>
            <TabsTrigger value="ferias" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Férias</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="ficha" className="mt-8 flex-1 flex flex-col md:mt-10">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {fichaItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border-border dark:border-white/20 border rounded-lg">
                <AccordionTrigger className="p-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <p className="text-muted-foreground whitespace-pre-wrap">{item.content}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-auto pt-4">
            <Button className="w-full">Salvar Alterações</Button>
          </div>
        </TabsContent>
        <TabsContent value="faltas" className="mt-8 flex flex-col flex-1 md:mt-10">
           <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarX className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">Faltas</CardTitle>
              </div>
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Falta
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {faltas.map((falta, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background">
                  <div>
                    <p className="font-medium">{falta.date}</p>
                    <p className="text-sm text-muted-foreground">{falta.reason}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="mt-auto pt-4">
            <Button className="w-full">Salvar Alterações</Button>
          </div>
        </TabsContent>
        <TabsContent value="licencas" className="mt-8 md:mt-10">
          <p className="text-center text-muted-foreground">Conteúdo de Licenças.</p>
        </TabsContent>
        <TabsContent value="ferias" className="mt-8 md:mt-10">
          <p className="text-center text-muted-foreground">Conteúdo de Férias.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    

    

    