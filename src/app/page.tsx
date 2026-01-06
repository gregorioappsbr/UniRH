
'use client';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServerList } from '@/components/server-list';
import { Users, User, ChevronDown, ShieldCheck, ArrowRightLeft, FileText, Briefcase } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';

const vinculos = [
  {
    nome: 'Efetivo',
    quantidade: 2,
    icon: ShieldCheck,
    href: '/servidores?vinculo=efetivo',
  },
  {
    nome: 'Terceirizado',
    quantidade: 1,
    icon: Users,
    href: '/servidores?vinculo=terceirizado',
  },
  {
    nome: 'Cedido',
    quantidade: 0,
    icon: ArrowRightLeft,
    href: '/servidores?vinculo=cedido',
  },
  {
    nome: 'Contratado',
    quantidade: 1,
    icon: FileText,
    href: '/servidores?vinculo=contratado',
  },
  {
    nome: 'Comissionado',
    quantidade: 1,
    icon: Briefcase,
    href: '/servidores?vinculo=comissionado',
  },
];


export default function Home() {
  return (
    <div className="p-4 space-y-6">
      <Header />
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <Card className="bg-card">
            <AccordionTrigger className="w-full hover:no-underline p-4">
              <div className="flex justify-between items-start w-full">
                <div className="space-y-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Servidores
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="text-4xl font-bold">5</div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                    <Users className="h-5 w-5 shrink-0 transition-transform duration-200" />
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                 <p className="text-xs text-green-500 mb-4 ml-2">+2 este mês</p>
                 <p className="text-sm text-muted-foreground mb-4">Detalhes por vínculo:</p>
                 <div className="space-y-4">
                  {vinculos.map((vinculo) => (
                    <Link href={vinculo.href} key={vinculo.nome} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <vinculo.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{vinculo.nome}</span>
                      </div>
                      <span className="font-bold">{vinculo.quantidade}</span>
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
