'use client';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServerList } from '@/components/server-list';
import { Users, User, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


const servers = [
  {
    id: '1',
    initials: 'AMS',
    name: 'Ana Maria da Silva e Souza',
  },
  {
    id: '2',
    name: 'Bruno Costa',
    initials: 'BC',
  },
  {
    id: '3',
    name: 'Carla Dias',
    initials: 'CD',
  },
  {
    id: '4',
    name: 'Lilian Tenório Carvalho',
    initials: 'LTC',
  },
  {
    id: '5',
    name: 'Mirna Almeida',
    initials: 'MA',
  },
];


export default function Home() {
  return (
    <div className="p-4 space-y-6">
      <Header />
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <Card className="bg-card">
            <AccordionTrigger className="w-full hover:no-underline">
              <CardHeader className="flex flex-row items-center justify-between pb-2 w-full">
                <div className='flex items-center space-x-4'>
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium">
                    Total de Servidores
                  </CardTitle>
                </div>
                <div className="flex items-center">
                    <div className="text-4xl font-bold mr-2">5</div>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </div>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                 <p className="text-xs text-green-500 mb-4 ml-2">+2 este mês</p>
                <div className="space-y-4">
                  {servers.map((server) => (
                    <Link href={`/servidores/${server.id}`} key={server.id}>
                      <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                        <Avatar>
                          <AvatarFallback>{server.initials}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{server.name}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
      <ServerList />
    </div>
  );
}
