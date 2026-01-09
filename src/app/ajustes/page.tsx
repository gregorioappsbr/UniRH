
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Settings, CalendarDays, Share, Trash2, Sun, Moon, Laptop, Save } from 'lucide-react';
import { useUser, useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { collection } from 'firebase/firestore';

const staticEvents = [
  {
    servidor: "Ana Silva",
    tipo: "Férias",
    periodo: "30/06/2024 a 14/07/2024",
  },
  {
    servidor: "Bruno Costa",
    tipo: "Licença (Paternidade)",
    periodo: "09/07/2024 a 14/07/2024",
  },
  {
    servidor: "Carla Dias",
    tipo: "Falta",
    periodo: "19/07/2024",
  },
];

type Theme = "light" | "dark" | "system";

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('dark');
  const [selectedServer, setSelectedServer] = useState('todos');

  const serversQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'servers');
  }, [firestore]);

  const { data: servers, isLoading: isLoadingServers } = useCollection<any>(serversQuery);

  const displayedEvents = useMemo(() => {
    if (selectedServer === 'todos') {
      return staticEvents;
    }
    return staticEvents.filter(event => event.servidor === selectedServer);
  }, [selectedServer]);

  // Effect to apply theme on initial load from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = storedTheme || 'dark';
    setCurrentTheme(initialTheme);
    setSelectedTheme(initialTheme);

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (initialTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(initialTheme);
    }
  }, []);

  // Effect to set user data once loaded
  useEffect(() => {
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

  const handleSaveChanges = async () => {
    if (!auth.currentUser) return;

    let profileUpdated = false;
    let themeUpdated = false;

    // --- Save Profile Changes (synced to Firebase Auth account) ---
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
      // We don't return here, so theme changes can still be attempted.
    }

    // --- Save Theme Changes (local to this browser only) ---
    if (selectedTheme !== currentTheme) {
        try {
            localStorage.setItem('theme', selectedTheme);
            setCurrentTheme(selectedTheme);
            
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
    
    // --- Show feedback toast ---
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="registros">Registros</TabsTrigger>
        </TabsList>
        <TabsContent value="geral" className="mt-6 space-y-6">
          <Card>
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
          <Card>
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
          <Card className="h-full">
            <CardHeader className="items-center text-center">
              <div className="flex items-center gap-3">
                  <CalendarDays className="h-6 w-6 text-primary" />
                  <CardTitle>Registros de Eventos</CardTitle>
              </div>
              <CardDescription>Visualize faltas, licenças e férias de todos os servidores.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Ver por Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mes">Ver por Mês</SelectItem>
                    <SelectItem value="ano">Ver por Ano</SelectItem>
                  </SelectContent>
                </Select>
                 <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="2026" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="janeiro">Janeiro</SelectItem>
                    <SelectItem value="fevereiro">Fevereiro</SelectItem>
                    <SelectItem value="marco">Março</SelectItem>
                    <SelectItem value="abril">Abril</SelectItem>
                    <SelectItem value="maio">Maio</SelectItem>
                    <SelectItem value="junho">Junho</SelectItem>
                    <SelectItem value="julho">Julho</SelectItem>
                    <SelectItem value="agosto">Agosto</SelectItem>
                    <SelectItem value="setembro">Setembro</SelectItem>
                    <SelectItem value="outubro">Outubro</SelectItem>
                    <SelectItem value="novembro">Novembro</SelectItem>
                    <SelectItem value="dezembro">Dezembro</SelectItem>
                  </SelectContent>
              </Select>
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
              <div className="grid grid-cols-2 gap-4">
                <Button className="bg-green-500 hover:bg-green-600 text-white"><Share className="mr-2 h-4 w-4" />Partilhar</Button>
                <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Excluir Vi...</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servidor</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Período</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedEvents.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{event.servidor}</TableCell>
                      <TableCell>{event.tipo}</TableCell>
                      <TableCell>{event.periodo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
