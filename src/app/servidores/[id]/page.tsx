
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Type, Building, Edit, Trash2, Award, CheckCircle, User, Heart, Home, Briefcase, GraduationCap, Info, CalendarX, PlusCircle, MoreHorizontal, KeyRound, AlertCircle, MinusCircle, FileText, Users, ScrollText } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, addDoc, deleteDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define a type for the server data
type Server = {
    id: string;
    initials: string;
    nomeCompleto: string;
    cargo: string;
    status: string;
    rating: number;
    emailInstitucional: string;
    telefonePrincipal: string;
    vinculo: string;
    setor: string;
    nomeSocial?: string;
    cpf?: string;
    rg?: string;
    orgaoEmissor?: string;
    possuiCNH?: string;
    cnhNumero?: string;
    cnhCategoria?: string;
    dataNascimento?: string;
    genero?: string;
    outroGenero?: string;
    corRaca?: string;
    estadoCivil?: string;
    nacionalidade?: string;
    naturalidade?: string;
    isPCD?: string;
    pcdDescricao?: string;
    nomeMae?: string;
    nomePai?: string;
    telefoneSecundario?: string;
    emailPessoal?: string;
    contatoEmergenciaNome?: string;
    contatoEmergenciaTelefone?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    matricula?: string;
    funcao?: string;
    dataInicio?: string;
    possuiDGA?: string;
    especificacaoDGA?: string;
    ramal?: string;
    jornada?: string;
    turno?: string;
    outroTurno?: string;
    escolaridade?: string;
    instituicaoEnsinoBasico?: string;
    anoConclusaoEnsinoBasico?: string;
    cursoGraduacao?: string;
    instituicaoGraduacao?: string;
    anoConclusaoGrad?: string;
    tipoPosGraduacao?: string;
    cursoPosGraduacao?: string;
    instituicaoPosGraduacao?: string;
    anoConclusaoPosGrad?: string;
    observacoes?: string;
};

type Falta = {
  id: string;
  date: string;
  reason: string;
}

type Licenca = {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
}


export default function ServerProfilePage() {
    const params = useParams();
    const { id } = params;
    const firestore = useFirestore();
    const { toast } = useToast();

    const [isFaltaDialogOpen, setIsFaltaDialogOpen] = useState(false);
    const [faltaReason, setFaltaReason] = useState('');
    const [faltaDia, setFaltaDia] = useState('');
    const [faltaMes, setFaltaMes] = useState('');
    const [faltaAno, setFaltaAno] = useState('');

    const serverRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'servers', id as string);
    }, [firestore, id]);
    
    const faltasQuery = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return collection(firestore, 'servers', id as string, 'faltas');
    }, [firestore, id]);

    const licencasQuery = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return collection(firestore, 'servers', id as string, 'licencas');
    }, [firestore, id]);

    const { data: server, isLoading: isLoadingServer } = useDoc<Server>(serverRef);
    const { data: faltas, isLoading: isLoadingFaltas } = useCollection<Falta>(faltasQuery);
    const { data: licencas, isLoading: isLoadingLicencas } = useCollection<Licenca>(licencasQuery);
    
    const handleSaveFalta = async () => {
        const dia = parseInt(faltaDia, 10);
        const mes = parseInt(faltaMes, 10);
        const ano = parseInt(faltaAno, 10);

        if (!firestore || !id || !dia || !mes || !ano || dia > 31 || mes > 12 || ano < 2000) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Data inválida. Por favor, verifique os campos.' });
            return;
        }

        const dataCompleta = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;

        try {
            const faltasCollectionRef = collection(firestore, 'servers', id as string, 'faltas');
            await addDoc(faltasCollectionRef, {
                date: dataCompleta,
                reason: faltaReason,
            });
            toast({ title: 'Sucesso', description: 'Falta registrada com sucesso.' });
            setIsFaltaDialogOpen(false);
            setFaltaDia('');
            setFaltaMes('');
            setFaltaAno('');
            setFaltaReason('');
        } catch (error) {
            console.error("Erro ao registrar falta:", error);
            toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível registrar a falta.' });
        }
    };

    const handleDeleteFalta = async (faltaId: string) => {
      if (!firestore || !id || !faltaId) return;
      try {
        const faltaDocRef = doc(firestore, 'servers', id as string, 'faltas', faltaId);
        await deleteDoc(faltaDocRef);
        toast({ title: 'Sucesso', description: 'Falta removida com sucesso.' });
      } catch (error) {
        console.error("Erro ao remover falta:", error);
        toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível remover a falta.' });
      }
    };


    const calculatedRating = 10 - ((faltas?.length ?? 0) * 1) - ((licencas?.length ?? 0) * 0.5);

    const fichaItems = server ? [
      {
        icon: User,
        label: "Dados Pessoais",
        content: [
          { label: "Nome Completo", value: server.nomeCompleto },
          { label: "Nome Social", value: server.nomeSocial },
          { label: "CPF", value: server.cpf },
          { label: "RG", value: server.rg },
          { label: "Órgão Emissor", value: server.orgaoEmissor },
          { label: "Possui CNH?", value: server.possuiCNH },
          ...(server.possuiCNH === 'sim' ? [
            { label: "Número CNH", value: server.cnhNumero },
            { label: "Categoria CNH", value: server.cnhCategoria }
          ] : []),
          { label: "Data de Nascimento", value: server.dataNascimento },
          { label: "Gênero", value: server.genero === 'outro' ? server.outroGenero : server.genero },
          { label: "Cor/Raça", value: server.corRaca },
          { label: "Estado Civil", value: server.estadoCivil },
          { label: "Nacionalidade", value: server.nacionalidade },
          { label: "Naturalidade", value: server.naturalidade },
          { label: "É PCD?", value: server.isPCD },
          ...(server.isPCD === 'sim' ? [{ label: "Descrição PCD", value: server.pcdDescricao }] : []),
        ]
      },
      {
        icon: Users,
        label: "Filiação",
        content: [
          { label: "Nome da Mãe", value: server.nomeMae },
          { label: "Nome do Pai", value: server.nomePai },
        ]
      },
      {
        icon: WhatsAppIcon,
        label: "Contato",
        content: [
          { label: "Telefone Principal", value: server.telefonePrincipal },
          { label: "Telefone Secundário", value: server.telefoneSecundario },
          { label: "Email Pessoal", value: server.emailPessoal },
        ]
      },
      {
        icon: Heart,
        label: "Contato de Emergência",
        content: [
          { label: "Nome", value: server.contatoEmergenciaNome },
          { label: "Telefone", value: server.contatoEmergenciaTelefone },
        ]
      },
      {
        icon: Home,
        label: "Endereço",
        content: [
          { label: "CEP", value: server.cep },
          { label: "Logradouro", value: server.logradouro },
          { label: "Número", value: server.numero },
          { label: "Complemento", value: server.complemento },
          { label: "Bairro", value: server.bairro },
          { label: "Cidade", value: server.cidade },
          { label: "UF", value: server.uf },
        ]
      },
      {
        icon: Briefcase,
        label: "Dados Profissionais",
        content: [
          { label: "Vínculo", value: server.vinculo },
          ...(server.vinculo === 'Efetivo' ? [{ label: "Matrícula", value: server.matricula }] : []),
          { label: "Cargo", value: server.cargo },
          { label: "Função", value: server.funcao },
          { label: "Data de Início", value: server.dataInicio },
          { label: "Possui DGA?", value: server.possuiDGA },
          ...(server.possuiDGA === 'sim' ? [{ label: "Especificação DGA", value: server.especificacaoDGA }] : []),
          { label: "Setor / Lotação", value: server.setor },
          { label: "Ramal", value: server.ramal },
          { label: "Jornada", value: server.jornada },
          { label: "Turno", value: server.turno === 'outro' ? server.outroTurno : server.turno },
          { label: "Status", value: server.status },
          { label: "Email Institucional", value: server.emailInstitucional },
        ]
      },
      {
        icon: GraduationCap,
        label: "Formação",
        content: [
            { label: "Escolaridade", value: server.escolaridade },
            ...(server.escolaridade === 'ensino-fundamental' || server.escolaridade === 'ensino-medio' ? [
                { label: "Instituição de Ensino", value: server.instituicaoEnsinoBasico },
                { label: "Ano de Conclusão", value: server.anoConclusaoEnsinoBasico }
            ] : []),
            ...(server.escolaridade === 'graduacao' || server.escolaridade === 'pos-graduacao' ? [
                { label: "Curso de Graduação", value: server.cursoGraduacao },
                { label: "Instituição de Graduação", value: server.instituicaoGraduacao },
                { label: "Ano de Conclusão da Graduação", value: server.anoConclusaoGrad }
            ] : []),
            ...(server.escolaridade === 'pos-graduacao' ? [
                { label: "Tipo de Pós-Graduação", value: server.tipoPosGraduacao },
                { label: "Curso de Pós-Graduação", value: server.cursoPosGraduacao },
                { label: "Instituição de Pós-Graduação", value: server.instituicaoPosGraduacao },
                { label: "Ano de Conclusão da Pós-Graduação", value: server.anoConclusaoPosGrad }
            ] : []),
        ]
      },
      {
        icon: FileText,
        label: "Observações",
        content: [
          { label: "Observações Gerais", value: server.observacoes },
        ]
      },
    ] : [];

  const getRatingClass = (rating: number) => {
    if (rating >= 8) return 'text-green-600 border-green-500 dark:text-green-400 dark:border-green-400';
    if (rating >= 4) return 'text-yellow-600 border-yellow-500 dark:text-yellow-400 dark:border-yellow-400';
    return 'text-red-600 border-red-500 dark:text-red-400 dark:border-red-400';
  };

  const getStatusClass = (status: string) => {
    if (status === 'Ativo') return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/50';
    if (status === 'Licença') return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/50';
    return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/50';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Ativo') return <CheckCircle className="h-3 w-3 mr-1" />;
    if (status === 'Licença') return <AlertCircle className="h-3 w-3 mr-1" />;
    return <MinusCircle className="h-3 w-3 mr-1" />;
  }

  const formatWhatsAppLink = (phone: string) => {
    if (!phone) return '';
    const justNumbers = phone.replace(/\D/g, '');
    return `https://wa.me/55${justNumbers}`;
  }

  const isLoading = isLoadingServer || isLoadingFaltas || isLoadingLicencas;

  if (isLoading) {
    return <div className="p-4 text-center">Carregando...</div>;
  }

  if (!server) {
    return <div className="p-4 text-center">Servidor não encontrado.</div>;
  }

  return (
    <div className="p-4 space-y-4 flex flex-col flex-1 h-full">
      <header className="flex items-center">
        <Button variant="ghost" asChild className="hover:text-primary p-2">
          <Link href="/servidores" className="flex items-center gap-2 text-lg">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold">Voltar</span>
          </Link>
        </Button>
      </header>

      <Card className="bg-card text-card-foreground">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-4xl">
                {server.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{server.nomeCompleto}</h2>
              <p className="text-muted-foreground">{server.cargo}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={cn("font-semibold", getStatusClass(server.status))}>
                {getStatusIcon(server.status)}
                {server.status}
              </Badge>
              <Badge variant="outline" className={cn("font-semibold", getRatingClass(calculatedRating))}>
                <Award className="h-3 w-3 mr-1" />
                Nota: {calculatedRating.toFixed(1)}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{server.emailInstitucional}</span>
            </div>
            <a href={formatWhatsAppLink(server.telefonePrincipal)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-base text-foreground hover:text-primary">
              <WhatsAppIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-base">{server.telefonePrincipal}</span>
            </a>
            <div className="flex items-center gap-4">
              <Type className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{server.vinculo}</span>
            </div>
            <div className="flex items-center gap-4">
              <Building className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{server.setor}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <Link href={`/servidores/novo?id=${id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Link>
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {server && (
        <Tabs defaultValue="ficha" className="w-full flex-1 flex flex-col">
          <div className="border dark:border-white/80 rounded-md">
            <TabsList className="h-auto items-center justify-center rounded-md p-1 flex flex-wrap w-full text-foreground bg-muted md:grid md:grid-cols-4">
              <TabsTrigger value="ficha" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Ficha</TabsTrigger>
              <TabsTrigger value="faltas" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Faltas</TabsTrigger>
              <TabsTrigger value="licencas" className="data-[state=active]:text-primary-foreground w-1/2 md:w_auto flex-grow">Licenças</TabsTrigger>
              <TabsTrigger value="ferias" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Férias</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="ficha" className="mt-8 flex-1 flex flex-col md:mt-10">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {fichaItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card border-border dark:border-white/80 border rounded-lg">
                  <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{item.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0">
                    <div className="space-y-2">
                      {item.content.map((detail, detailIndex) => (detail.value) && (
                        <div key={detailIndex} className="flex justify-between items-center text-sm p-2 bg-background dark:bg-muted/30 rounded-md">
                          <span className="font-semibold text-muted-foreground">{detail.label}:</span>
                          <span className="text-right text-foreground">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          <TabsContent value="faltas" className="mt-8 flex flex-col flex-1 md:mt-10">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarX className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">Faltas</CardTitle>
                </div>
                 <Dialog open={isFaltaDialogOpen} onOpenChange={setIsFaltaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adicionar Falta
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Registrar Nova Falta</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                       <div className="space-y-2">
                          <Label>Data da Falta</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              type="number"
                              placeholder="Dia"
                              value={faltaDia}
                              onChange={(e) => setFaltaDia(e.target.value)}
                              maxLength={2}
                            />
                             <Input
                              type="number"
                              placeholder="Mês"
                              value={faltaMes}
                              onChange={(e) => setFaltaMes(e.target.value)}
                              maxLength={2}
                            />
                             <Input
                              type="number"
                              placeholder="Ano"
                              value={faltaAno}
                              onChange={(e) => setFaltaAno(e.target.value)}
                              maxLength={4}
                            />
                          </div>
                       </div>
                      <div className="space-y-2">
                        <Label htmlFor="falta-reason">Motivo (Opcional)</Label>
                        <Textarea
                          id="falta-reason"
                          placeholder="Descreva o motivo da falta..."
                          value={faltaReason}
                          onChange={(e) => setFaltaReason(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setIsFaltaDialogOpen(false)}>Cancelar</Button>
                      <Button onClick={handleSaveFalta}>Salvar Falta</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingFaltas ? <p>Carregando faltas...</p> : (faltas && faltas.length > 0) ? (
                  faltas.map((falta) => (
                  <div key={falta.id} className="flex items-center justify-between p-4 rounded-lg bg-background">
                    <div>
                      <p className="font-medium">{falta.date}</p>
                      <p className="text-sm text-muted-foreground">{falta.reason || 'Sem justificativa'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { /* Lógica de edição aqui */ }}>
                        <Edit className="h-5 w-5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-5 w-5 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro de falta.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteFalta(falta.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">Nenhuma falta registrada.</p>
                )}
              </CardContent>
            </Card>
            <div className="mt-auto pt-4">
              <Button className="w-full">Salvar Alterações</Button>
            </div>
          </TabsContent>
          <TabsContent value="licencas" className="mt-8 md:mt-10">
            <p className="text-center text-muted-foreground">Conteúdo de Licenças.</p>
          </TabsContent>
          <TabsContent value="ferias" className="mt-8 md:mt-10">
            <p className="text-center text-muted-foreground">Conteúdo de Férias.</p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
 

    