'use client';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServerList } from '@/components/server-list';
import { Users, Briefcase } from 'lucide-react';

export default function Home() {
  return (
    <div className="p-4 space-y-6">
      <Header />
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Servidores
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">5</div>
          <p className="text-xs text-green-500">+2 este mês</p>
        </CardContent>
      </Card>
      <ServerList />
    </div>
  );
}
