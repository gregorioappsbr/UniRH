import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Star, KeyRound } from 'lucide-react';

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
    status: null,
    rating: null,
    phone: null,
  },
];

export function ServerList() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Servidores Recentes</CardTitle>
        <CardDescription>
          Uma lista das últimas adições à sua equipe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-b pb-2 text-sm text-muted-foreground">Nome</div>
        {servers.map((server, index) => (
          <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
            <Avatar>
              <AvatarFallback>{server.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{server.name}</p>
              <p className="text-sm text-muted-foreground">{server.email}</p>
              <div className="flex items-center gap-4 mt-2 text-xs">
                {server.status && (
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    <KeyRound className="w-3 h-3 mr-1" />
                    {server.status}
                  </Badge>
                )}
                {server.rating && (
                  <div className="flex items-center text-muted-foreground">
                    <Star className="w-3 h-3 mr-1 text-yellow-400" />
                    <span>Nota: {server.rating}</span>
                  </div>
                )}
              </div>
              {server.phone && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{server.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
