'use client';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServerList } from '@/components/server-list';
import { Users, User, ChevronDown, ShieldCheck, ArrowRightLeft, FileText, Briefcase } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const vinculos = [
  {
    nome: 'Efetivo',
    quantidade: 2,
    icon: ShieldCheck,
  },
  {
    nome: 'Terceirizado',
    quantidade: 1,
    icon: Users,
  },
  {
    nome: 'Cedido',
    quantidade: 0,
    icon: ArrowRightLeft,
  },
  {
    nome: 'Contratado',
    quantidade: 1,
    icon: FileText,
  },
  {
    nome: 'Comissionado',
    quantidade: 1,
    icon: Briefcase,
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
                  {vinculos.map((vinculo) => (
                    <div key={vinculo.nome} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <vinculo.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{vinculo.nome}</span>
                      </div>
                      <span className="font-bold">{vinculo.quantidade}</span>
                    </div>
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
