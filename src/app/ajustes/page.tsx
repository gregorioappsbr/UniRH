'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Settings, CalendarDays, Share, Trash2 } from 'lucide-react';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';

const events = [
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


export default function SettingsPage() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

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
                <Input id="name" defaultValue="Mirna" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="mirna.almeida@uems.br" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tema</CardTitle>
              <CardDescription>
                Personalize a aparência do aplicativo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline">Claro</Button>
                <Button variant="default">Escuro</Button>
                <Button variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">Sistema</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="registros" className="mt-6 flex-1">
          <Card className="h-full">
            <CardHeader>
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
                    <SelectValue placeholder="janeiro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="janeiro">janeiro</SelectItem>
                    <SelectItem value="fevereiro">fevereiro</SelectItem>
                    <SelectItem value="marco">março</SelectItem>
                  </SelectContent>
              </Select>
               <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os Servidores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Servidores</SelectItem>
                    <SelectItem value="ana">Ana Silva</SelectItem>
                    <SelectItem value="bruno">Bruno Costa</SelectItem>
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
                  {events.map((event, index) => (
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
            className="w-full bg-red-800/50 text-red-300 border border-red-700/50 hover:bg-red-800/70"
            onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair da Conta
        </Button>
        <Button className="w-full">Salvar Alterações</Button>
      </div>
    </div>
  );
}
