
'use client';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServerList } from '@/components/server-list';
import { Users, User, ChevronDown, ShieldCheck, ArrowRightLeft, FileText, Briefcase } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function Home() {
  const firestore = useFirestore();

  const serversQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'servers');
  }, [firestore]);

  const { data: servers, isLoading } = useCollection<any>(serversQuery);

  const vinculos = [
    {
      nome: 'Efetivo',
      icon: ShieldCheck,
      href: '/servidores?vinculo=efetivo',
      quantidade: servers?.filter(s => s.vinculo === 'Efetivo').length ?? 0,
    },
    {
      nome: 'Terceirizado',
      icon: Users,
      href: '/servidores?vinculo=terceirizado',
      quantidade: servers?.filter(s => s.vinculo === 'Terceirizado').length ?? 0,
    },
    {
      nome: 'Cedido',
      icon: ArrowRightLeft,
      href: '/servidores?vinculo=cedido',
      quantidade: servers?.filter(s => s.vinculo === 'Cedido').length ?? 0,
    },
    {
      nome: 'Contratado',
      icon: FileText,
      href: '/servidores?vinculo=contratado',
      quantidade: servers?.filter(s => s.vinculo === 'Contratado').length ?? 0,
    },
    {
      nome: 'Comissionado',
      icon: Briefcase,
      href: '/servidores?vinculo=comissionado',
      quantidade: servers?.filter(s => s.vinculo === 'Comissionado').length ?? 0,
    },
  ];

  const totalServidores = servers?.length ?? 0;

  return (
    <div className="p-4 space-y-6">
      <Header />
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" className="border-none">
          <Card className="bg-card">
            <AccordionTrigger className="w-full hover:no-underline p-4">
              <div className="flex justify-between items-start w-full">
                <div className="space-y-2 text-left">
                  <CardTitle className="text-sm font-medium">
                    Total de Servidores
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="text-4xl font-bold">
                      {isLoading ? '...' : totalServidores}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                    <Users className="h-5 w-5 shrink-0 transition-transform duration-200" />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                 <p className="text-xs text-muted-foreground mb-4 ml-2">Detalhes por vínculo:</p>
                 <div className="space-y-4">
                  {vinculos.map((vinculo) => (
                    <Link href={vinculo.href} key={vinculo.nome} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <vinculo.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{vinculo.nome}</span>
                      </div>
                      <span className="font-bold">{isLoading ? '...' : vinculo.quantidade}</span>
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
