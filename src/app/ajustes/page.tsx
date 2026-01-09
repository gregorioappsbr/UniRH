
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Settings, CalendarDays, Share, Sun, Moon, Laptop, Save, FileText, Copy, FileDown } from 'lucide-react';
import { useUser, useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { collection, getDocs, query } from 'firebase/firestore';
import type { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

type Theme = "light" | "dark" | "system";

type EventRecord = {
  servidor: string;
  tipo: 'Férias' | 'Licença' | 'Falta';
  periodo: string;
  descricao: string;
  startDate: Date;
  endDate: Date;
};

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('dark');
  
  const [allEvents, setAllEvents] = useState<EventRecord[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [view, setView] = useState('mensal');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedServer, setSelectedServer] = useState('todos');

  const serversQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'servers');
  }, [firestore]);

  const { data: servers, isLoading: isLoadingServers } = useCollection<any>(serversQuery);
  
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setSelectedTheme(storedTheme);
    }

    setSelectedMonth((new Date().getMonth() + 1).toString());
    
    if (user) {
      if (user.email === 'litencarv@uems.br') {
        setName('Lilian Tenório');
      } else if (user.email === 'mirna.almeida@uems.br') {
        setName('Mirna Almeida');
      } else {
        setName(user.displayName || '');
      }
      setEmail(user.email || '');
    }
  }, [user]);

  // Effect to fetch all events from all servers
  useEffect(() => {
    const fetchAllEvents = async () => {
      if (!firestore || !servers) return;
      
      setIsLoadingEvents(true);
      const events: EventRecord[] = [];
      
      for (const server of servers) {
        const serverId = server.id;
        const serverName = server.nomeCompleto;

        // Fetch Faltas
        const faltasQuery = query(collection(firestore, 'servers', serverId, 'faltas'));
        const faltasSnapshot = await getDocs(faltasQuery);
        faltasSnapshot.forEach(doc => {
          const data = doc.data();
          const [day, month, year] = data.date.split('/');
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          events.push({ servidor: serverName, tipo: 'Falta', periodo: data.date, descricao: data.reason || '-', startDate: date, endDate: date });
        });
        
        // Fetch Licenças
        const licencasQuery = query(collection(firestore, 'servers', serverId, 'licencas'));
        const licencasSnapshot = await getDocs(licencasQuery);
        licencasSnapshot.forEach(doc => {
          const data = doc.data();
          const [startDay, startMonth, startYear] = data.startDate.split('/');
          const [endDay, endMonth, endYear] = data.endDate.split('/');
          const startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
          const endDate = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay));
          const finalReason = data.type === 'outro' ? data.reason : `${data.type} - ${data.reason || 'Sem descrição'}`;
          events.push({ servidor: serverName, tipo: 'Licença', periodo: `${data.startDate} a ${data.endDate}`, descricao: finalReason, startDate, endDate });
        });
        
        // Fetch Férias
        const feriasQuery = query(collection(firestore, 'servers', serverId, 'ferias'));
        const feriasSnapshot = await getDocs(feriasQuery);
        feriasSnapshot.forEach(doc => {
          const data = doc.data();
          const [startDay, startMonth, startYear] = data.startDate.split('/');
          const [endDay, endMonth, endYear] = data.endDate.split('/');
          const startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
          const endDate = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay));
          events.push({ servidor: serverName, tipo: 'Férias', periodo: `${data.startDate} a ${data.endDate}`, descricao: data.periodoAquisitivo || '-', startDate, endDate });
        });
      }
      
      setAllEvents(events.sort((a,b) => a.startDate.getTime() - b.startDate.getTime()));
      setIsLoadingEvents(false);
    };

    if(servers) fetchAllEvents();
  }, [firestore, servers]);

  const displayedEvents = useMemo(() => {
    let filtered = allEvents;
    
    // Filter by server
    if (selectedServer !== 'todos') {
      filtered = filtered.filter(event => event.servidor === selectedServer);
    }
    
    // Filter by date
    if (view === 'mensal') {
      filtered = filtered.filter(event => 
        event.startDate.getFullYear().toString() === selectedYear &&
        (event.startDate.getMonth() + 1).toString() === selectedMonth
      );
    } else { // anual
       filtered = filtered.filter(event => event.startDate.getFullYear().toString() === selectedYear);
    }

    return filtered;
  }, [allEvents, selectedServer, view, selectedYear, selectedMonth]);

  const handleSaveChanges = async () => {
    if (!auth.currentUser) return;

    let profileUpdated = false;
    let themeUpdated = false;

    try {
      if (name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
        profileUpdated = true;
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
       toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível salvar as alterações no perfil.',
      });
    }

    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (selectedTheme !== currentTheme) {
        try {
            localStorage.setItem('theme', selectedTheme);
            
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');

            if (selectedTheme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                root.classList.add(systemTheme);
            } else {
                root.classList.add(selectedTheme);
            }
            themeUpdated = true;
        } catch (error) {
             console.error('Erro ao salvar tema:', error);
             toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Não foi possível salvar o tema neste navegador.',
            });
        }
    }
    
    if (profileUpdated && themeUpdated) {
        toast({
            title: "Alterações salvas!",
            description: "Seu perfil e tema foram atualizados.",
        });
    } else if (profileUpdated) {
        toast({
            title: "Perfil atualizado!",
            description: "Suas informações de perfil foram salvas.",
        });
    } else if (themeUpdated) {
        toast({
            title: "Tema atualizado!",
            description: "Sua preferência de tema foi salva neste navegador.",
        });
    } else {
         toast({
            title: "Nenhuma alteração",
            description: "Nenhuma nova configuração para salvar.",
        });
    }

    router.push('/');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getEventsAsText = () => {
    if (displayedEvents.length === 0) return "Nenhum evento para exibir.";
    
    const title = `Relatório de Eventos - ${view === 'anual' ? `Ano ${selectedYear}` : `${selectedMonth}/${selectedYear}`}${selectedServer !== 'todos' ? ` - ${selectedServer}` : ''}`;
    
    const header = "Servidor | Tipo | Período | Descrição\n------------------------------------\n";
    const body = displayedEvents.map(e => `${e.servidor} | ${e.tipo} | ${e.periodo} | ${e.descricao}`).join('\n');
    return `${title}\n\n${header}${body}`;
  };

  const handleShare = async () => {
    const textToShare = getEventsAsText();
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Relatório de Eventos', text: textToShare });
      } catch (error) { 
        if (error instanceof DOMException && (error.name === 'AbortError' || error.name === 'NotAllowedError')) {
          // User cancelled the share sheet, do nothing.
        } else {
          console.error('Erro ao compartilhar', error); 
        }
      }
    } else {
      handleCopy();
      toast({ title: 'Copiado!', description: 'Seu navegador não suporta compartilhamento. O conteúdo foi copiado.' });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getEventsAsText()).then(() => {
      toast({ title: 'Copiado!', description: 'O relatório foi copiado para a área de transferência.' });
    }).catch(err => {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível copiar o relatório.' });
    });
  };

  const handleShareWhatsApp = () => {
    const encodedText = encodeURIComponent(getEventsAsText());
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  const handleExportPDF = async () => {
    if (displayedEvents.length === 0) {
      toast({ variant: "destructive", title: "Nenhum dado", description: "Não há eventos para exportar no período selecionado." });
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      const title = `Relatório de Eventos - ${view === 'anual' ? `Ano ${selectedYear}` : `${selectedMonth}/${selectedYear}`}`;
      const subtitle = selectedServer !== 'todos' ? selectedServer : 'Todos os Servidores';

      doc.setFontSize(18);
      doc.text(title, 14, 22);
      doc.setFontSize(12);
      doc.text(subtitle, 14, 30);

      (doc as any).autoTable({
        startY: 35,
        head: [['Servidor', 'Tipo', 'Período', 'Descrição']],
        body: displayedEvents.map(e => [e.servidor, e.tipo, e.periodo, e.descricao]),
        theme: 'striped',
        headStyles: { fillColor: [30, 144, 255] }, // Azul (cor primária)
      });
      
      doc.save(`relatorio_eventos_${view}_${selectedYear}.pdf`);
    } catch(error) {
       console.error('Erro ao exportar PDF', error);
       toast({
          variant: 'destructive',
          title: 'Erro ao exportar',
          description: 'Não foi possível exportar o relatório como PDF.',
        });
    }
  };
  
  if (isUserLoading || isLoadingServers) {
    return <div className="p-4 text-center">Carregando...</div>
  }

  return (
    <div className="p-4 space-y-6 flex flex-col flex-1 h-full">
      <header className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">CONFIGURAÇÕES</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Gerencie as configurações da sua conta e preferências de exibição.
        </p>
      </header>

      <Tabs defaultValue="geral" className="w-full flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 border dark:text-foreground">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="registros">Registros</TabsTrigger>
        </TabsList>
        <TabsContent value="geral" className="mt-6 space-y-6">
          <Card className="border">
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>
                Estes dados são usados para identificar você na plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
              </div>
            </CardContent>
          </Card>
          <Card className="border">
            <CardHeader>
              <CardTitle>Tema</CardTitle>
              <CardDescription>
                Personalize a aparência do aplicativo. Esta configuração é salva apenas neste navegador.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className={cn(
                    'flex items-center gap-2 h-16 bg-white text-black hover:bg-gray-200 hover:text-black',
                    selectedTheme === 'light' && 'ring-2 ring-primary'
                  )}
                  onClick={() => setSelectedTheme('light')}
                >
                  <Sun className="h-5 w-5" />
                  Claro
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    'flex items-center gap-2 h-16 bg-black text-white hover:bg-gray-800 hover:text-white',
                    selectedTheme === 'dark' && 'ring-2 ring-primary'
                  )}
                  onClick={() => setSelectedTheme('dark')}
                >
                  <Moon className="h-5 w-5" />
                  Escuro
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    'flex items-center gap-2 h-16',
                    selectedTheme === 'system' && 'ring-2 ring-primary'
                  )}
                  onClick={() => setSelectedTheme('system')}
                >
                  <Laptop className="h-5 w-5" />
                  Sistema
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="registros" className="mt-6 flex-1">
          <Card className="h-full border">
            <CardHeader className="items-center text-center">
              <div className="flex items-center gap-3">
                  <CalendarDays className="h-6 w-6 text-primary" />
                  <CardTitle>Registros de Eventos</CardTitle>
              </div>
              <CardDescription>Visualize e exporte faltas, licenças e férias de todos os servidores.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-3 gap-4">
                 <Select value={view} onValueChange={setView}>
                  <SelectTrigger>
                    <SelectValue placeholder="Visualização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
                 <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={view === 'anual'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Janeiro</SelectItem>
                    <SelectItem value="2">Fevereiro</SelectItem>
                    <SelectItem value="3">Março</SelectItem>
                    <SelectItem value="4">Abril</SelectItem>
                    <SelectItem value="5">Maio</SelectItem>
                    <SelectItem value="6">Junho</SelectItem>
                    <SelectItem value="7">Julho</SelectItem>
                    <SelectItem value="8">Agosto</SelectItem>
                    <SelectItem value="9">Setembro</SelectItem>
                    <SelectItem value="10">Outubro</SelectItem>
                    <SelectItem value="11">Novembro</SelectItem>
                    <SelectItem value="12">Dezembro</SelectItem>
                  </SelectContent>
              </Select>
              </div>
               <Select value={selectedServer} onValueChange={setSelectedServer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Servidor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Servidores</SelectItem>
                    {servers?.map((server) => (
                      <SelectItem key={server.id} value={server.nomeCompleto}>{server.nomeCompleto}</SelectItem>
                    ))}
                  </SelectContent>
              </Select>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full" variant="outline">
                    <Share className="mr-2 h-4 w-4 text-primary" />
                    Exportar / Compartilhar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                   <DropdownMenuItem onClick={handleExportPDF}>
                    <FileDown className="mr-2 h-4 w-4" />
                    <span>Exportar como PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareWhatsApp}>
                    <WhatsAppIcon className="mr-2 h-4 w-4" />
                    <span>Compartilhar no WhatsApp</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copiar Texto</span>
                  </DropdownMenuItem>
                   <DropdownMenuItem onClick={handleShare}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Outras Opções</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              { isLoadingEvents ? <p className="text-center">Carregando eventos...</p> : 
                (displayedEvents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Servidor</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedEvents.map((event, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{event.servidor}</TableCell>
                          <TableCell>{event.tipo}</TableCell>
                          <TableCell>{event.periodo}</TableCell>
                          <TableCell>{event.descricao}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-4">Nenhum evento encontrado para os filtros selecionados.</p>
                ))
              }
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="space-y-4 mt-auto">
        <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair da Conta
        </Button>
        <Button className="w-full" onClick={handleSaveChanges}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}

    

    