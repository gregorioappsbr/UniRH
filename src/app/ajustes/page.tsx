'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Settings } from 'lucide-react';

export default function SettingsPage() {
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
        <TabsContent value="geral" className="mt-6 space-y-6 flex-1">
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
        <TabsContent value="registros" className="flex-1">
          {/* Content for Registros tab */}
        </TabsContent>
      </Tabs>
      <div className="space-y-4 mt-auto">
        <Button variant="destructive" className="w-full bg-red-800/50 text-red-300 border border-red-700/50 hover:bg-red-800/70">
          <LogOut className="mr-2 h-4 w-4" />
          Sair da Conta
        </Button>
        <Button className="w-full">Salvar Alterações</Button>
      </div>
    </div>
  );
}
