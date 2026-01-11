

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, PlusCircle, Filter, Award, MinusCircle, AlertCircle, Briefcase, Code, PenTool, GraduationCap, UserCog, KeyRound, Share, Trash2, FileText, Copy, FileDown, CheckSquare, CheckCircle, Link2, ScrollText, UserPlus, FileSignature } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { useIsMobile } from '@/hooks/use-mobile';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetTrigger, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from "jspdf";
import { useRouter, useSearchParams } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc, getDocs, query, writeBatch, addDoc, serverTimestamp } from 'firebase/firestore';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getServerColor } from '@/lib/color-utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


const statusOptions = ['Ativo', 'Inativo', 'Licença'];
const vinculoOptions = ['Efetivo', 'Terceirizado', 'Cedido', 'Contratado', 'Comissionado'];

export default function ServerListPage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();

  const serversQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'servers');
  }, [firestore]);

  const { data: servers, isLoading } = useCollection<any>(serversQuery);
  
  const [serversWithRatings, setServersWithRatings] = useState<any[]>([]);
  const [selectedServers, setSelectedServers] = useState<Record<string, boolean>>({});
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [vinculoFilters, setVinculoFilters] = useState<string[]>([]);
  const [preCadastroLink, setPreCadastroLink] = useState('');
  const [customShareMessage, setCustomShareMessage] = useState('Por favor, preencha o formulário de registro de servidor:');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  const sortedServers = useMemo(() => {
    if (!servers) return [];
    return [...servers].sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));
  }, [servers]);

  useEffect(() => {
    const calculateRatings = async () => {
      if (!sortedServers || !firestore) return;
      
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const serversData = await Promise.all(
        sortedServers.map(async (server) => {
          const faltasQuery = query(collection(firestore, 'servers', server.id, 'faltas'));
          const licencasQuery = query(collection(firestore, 'servers', server.id, 'licencas'));
          
          const [faltasSnapshot, licencasSnapshot] = await Promise.all([
            getDocs(faltasQuery),
            getDocs(licencasQuery),
          ]);

          const faltasThisMonth = faltasSnapshot.docs.filter(doc => {
            const data = doc.data();
            const [, month, year] = data.date.split('/');
            return parseInt(month, 10) === currentMonth && parseInt(year, 10) === currentYear;
          }).length;

          const licencasThisMonth = licencasSnapshot.docs.filter(doc => {
            const data = doc.data();
            const [, month, year] = data.startDate.split('/');
            return parseInt(month, 10) === currentMonth && parseInt(year, 10) === currentYear;
          }).length;
          
          const calculatedRating = 10 - (faltasThisMonth * 1) - (licencasThisMonth * 0.5);
          return { ...server, calculatedRating };
        })
      );

      setServersWithRatings(serversData);
    };

    calculateRatings();
  }, [sortedServers, firestore]);

  useEffect(() => {
    const vinculoQuery = searchParams.get('vinculo');
    if (vinculoQuery) {
      const capitalizedVinculo = vinculoQuery.charAt(0).toUpperCase() + vinculoQuery.slice(1);
      if (vinculoOptions.includes(capitalizedVinculo) && !vinculoFilters.includes(capitalizedVinculo)) {
        setVinculoFilters(prev => [...prev, capitalizedVinculo]);
      }
    }
  }, [searchParams]);

  const selectionCount = Object.values(selectedServers).filter(Boolean).length;

  const handleSelectAll = (checked: boolean) => {
    const newSelectedServers: Record<string, boolean> = {};
    if (checked) {
      filteredServers.forEach(server => {
        newSelectedServers[server.id] = true;
      });
    }
    setSelectedServers(newSelectedServers);
  };

  const handleSelectServer = (id: string, checked: boolean) => {
    setSelectedServers(prev => ({
      ...prev,
      [id]: checked,
    }));
  };
  
  const handleStatusFilterChange = (status: string) => {
    setStatusFilters(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleVinculoFilterChange = (vinculo: string) => {
    setVinculoFilters(prev => 
      prev.includes(vinculo) ? prev.filter(v => v !== vinculo) : [...prev, v]
    );
  };

  const clearFilters = () => {
    setStatusFilters([]);
    setVinculoFilters([]);
  };

  const filteredServers = useMemo(() => {
    return serversWithRatings.filter(server => {
      const statusMatch = statusFilters.length === 0 || statusFilters.includes(server.status);
      const vinculoMatch = vinculoFilters.length === 0 || vinculoFilters.includes(server.vinculo);
      return statusMatch && vinculoMatch;
    });
  }, [serversWithRatings, statusFilters, vinculoFilters]);


  const allSelected = filteredServers.length > 0 && selectionCount === filteredServers.length;


  const getRatingClass = (rating: number) => {
    if (rating >= 8) return 'text-green-500';
    if (rating >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusClass = (status: string) => {
    if (status === 'Ativo') return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300 border-green-500/50';
    if (status === 'Licença') return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border-yellow-500/50';
    return 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border-red-500/50';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Ativo') return <CheckCircle className="w-3 h-3 mr-1" />;
    if (status === 'Licença') return <AlertCircle className="w-3 h-3 mr-1" />;
    return <MinusCircle className="w-3 h-3 mr-1" />;
  }
  
  const formatWhatsAppLink = (phone: string) => {
    if (!phone) return '';
    const justNumbers = phone.replace(/\D/g, '');
    return `https://wa.me/55${justNumbers}`;
  }

  const getFuncaoIcon = (funcao: string) => {
    switch (funcao) {
      case 'Gerente de Projetos':
        return <UserCog className="h-4 w-4" />;
      case 'Desenvolvedor Frontend':
        return <Code className="h-4 w-4" />;
      case 'Desenvolvedor Backend':
        return <Code className="h-4 w-4" />;
      case 'Designer UI/UX':
        return <PenTool className="h-4 w-4" />;
      case 'Estagiário':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  const getSelectedServersDetails = (server: (typeof serversWithRatings)[0], forWhatsApp: boolean = false) => {
    if (forWhatsApp) {
        const underline = '--------------------';
        let details = `*FICHA COMPLETA - ${server.nomeCompleto.toUpperCase()}*\n${underline}\n\n`;

        details += `*DADOS PESSOAIS*\n${underline}\n`;
        details += `*NOME COMPLETO:* ${server.nomeCompleto.toUpperCase()}\n`;
        if (server.nomeSocial) details += `*NOME SOCIAL:* ${server.nomeSocial.toUpperCase()}\n`;
        details += `*CPF:* ${server.cpf}\n`;
        details += `*RG:* ${server.rg}\n`;
        details += `*DATA DE NASCIMENTO:* ${server.dataNascimento}\n`;
        details += `*GÊNERO:* ${server.genero}\n`;
        if (server.outroGenero) details += `*OUTRO GÊNERO:* ${server.outroGenero.toUpperCase()}\n`;
        details += `*COR/RAÇA:* ${server.corRaca}\n`;
        details += `*ESTADO CIVIL:* ${server.estadoCivil}\n`;
        details += `*NACIONALIDADE:* ${server.nacionalidade.toUpperCase()}\n`;
        details += `*NATURALIDADE:* ${server.naturalidade.toUpperCase()}\n`;
        details += `*PCD:* ${server.isPCD}\n`;
         if (server.pcdDescricao) details += `*DESCRIÇÃO PCD:* ${server.pcdDescricao.toUpperCase()}\n`;
        details += `\n`;
        
        details += `*FILIAÇÃO*\n${underline}\n`;
        details += `*NOME DA MÃE:* ${server.nomeMae.toUpperCase()}\n`;
        if (server.nomePai) details += `*NOME DO PAI:* ${server.nomePai.toUpperCase()}\n`;
        details += `\n`;

        details += `*CONTATO*\n${underline}\n`;
        details += `*TELEFONE PRINCIPAL:* ${server.telefonePrincipal}\n`;
        if (server.telefoneSecundario) details += `*TELEFONE SECUNDÁRIO:* ${server.telefoneSecundario}\n`;
        if (server.emailPessoal) details += `*E-MAIL PESSOAL:* ${server.emailPessoal}\n`;
        details += `*CONTATO DE EMERGÊNCIA:* ${server.contatoEmergenciaNome.toUpperCase()} - ${server.contatoEmergenciaTelefone}\n\n`;

        details += `*ENDEREÇO*\n${underline}\n`;
        details += `*CEP:* ${server.cep}\n`;
        details += `*LOGRADOURO:* ${server.logradouro.toUpperCase()}\n`;
        if (server.complemento) details += `*COMPLEMENTO:* ${server.complemento.toUpperCase()}\n`;
        details += `*BAIRRO:* ${server.bairro.toUpperCase()}\n`;
        details += `*CIDADE/ESTADO:* ${server.cidade.toUpperCase()}/${server.uf.toUpperCase()}\n\n`;

        details += `*DADOS PROFISSIONAIS*\n${underline}\n`;
        details += `*VÍNCULO:* ${server.vinculo}\n`;
        if (server.matricula) details += `*MATRÍCULA:* ${server.matricula}\n`;
        details += `*CARGO:* ${server.cargo.toUpperCase()}\n`;
        details += `*FUNÇÃO:* ${server.funcao.toUpperCase()}\n`;
        details += `*DATA DE INÍCIO:* ${server.dataInicio}\n`;
        details += `*POSSUI DGA?:* ${server.possuiDGA}\n`;
        if (server.especificacaoDGA) details += `*ESPECIFICAÇÃO DGA:* ${server.especificacaoDGA.toUpperCase()}\n`;
        details += `*SETOR:* ${server.setor.toUpperCase()}\n`;
        if(server.ramal) details += `*RAMAL:* ${server.ramal}\n`;
        details += `*JORNADA:* ${server.jornada}\n`;
        details += `*TURNO:* ${server.turno}\n`;
        if (server.outroTurno) details += `*OUTRO TURNO:* ${server.outroTurno.toUpperCase()}\n`;
        details += `*STATUS:* ${server.status}\n`;
        details += `*E-MAIL INSTITUCIONAL:* ${server.emailInstitucional}\n\n`;

        details += `*FORMAÇÃO*\n${underline}\n`;
        details += `*ESCOLARIDADE:* ${server.escolaridade}\n`;
        if(server.instituicaoEnsinoBasico) details += `*INSTITUIÇÃO:* ${server.instituicaoEnsinoBasico.toUpperCase()}\n`;
        if(server.anoConclusaoEnsinoBasico) details += `*ANO DE CONCLUSÃO:* ${server.anoConclusaoEnsinoBasico}\n`;
        if(server.cursoGraduacao) details += `*CURSO DE GRADUAÇÃO:* ${server.cursoGraduacao.toUpperCase()}\n`;
        if(server.instituicaoGraduacao) details += `*INSTITUIÇÃO DA GRADUAÇÃO:* ${server.instituicaoGraduacao.toUpperCase()}\n`;
        if(server.anoConclusaoGrad) details += `*ANO DE CONCLUSÃO (GRAD.):* ${server.anoConclusaoGrad}\n`;
        if (server.escolaridade === 'pos-graduacao') {
            if(server.tipoPosGraduacao) details += `*TIPO DE PÓS-GRADUAÇÃO:* ${server.tipoPosGraduacao.toUpperCase()}\n`;
            if(server.cursoPosGraduacao) details += `*CURSO DE PÓS-GRADUAÇÃO:* ${server.cursoPosGraduacao.toUpperCase()}\n`;
            if(server.instituicaoPosGraduacao) details += `*INSTITUIÇÃO DA PÓS-GRAD.:* ${server.instituicaoPosGraduacao.toUpperCase()}\n`;
            if(server.anoConclusaoPosGrad) details += `*ANO DE CONCLUSÃO (PÓS-GRAD.):* ${server.anoConclusaoPosGrad}\n`;
        }
        details += `\n`;

        if (server.observacoes) {
          details += `*OBSERVAÇÕES*\n${underline}\n`;
          details += `${server.observacoes.toUpperCase()}\n`;
        }

        return details.trim();
    }

      let details = `FICHA COMPLETA - ${server.nomeCompleto}\n\n`;

      details += "DADOS PESSOAIS\n";
      details += `Nome Completo: ${server.nomeCompleto}\n`;
      if (server.nomeSocial) details += `Nome Social: ${server.nomeSocial}\n`;
      details += `CPF: ${server.cpf}\n`;
      details += `RG: ${server.rg}\n`;
      details += `Data de Nascimento: ${server.dataNascimento}\n`;
      details += `Gênero: ${server.genero}\n`;
      if(server.outroGenero) details += `Outro Gênero: ${server.outroGenero}\n`;
      details += `Cor/Raça: ${server.corRaca}\n`;
      details += `Estado Civil: ${server.estadoCivil}\n`;
      details += `Nacionalidade: ${server.nacionalidade}\n`;
      details += `Naturalidade: ${server.naturalidade}\n`;
      details += `PCD: ${server.isPCD}\n`;
      if(server.pcdDescricao) details += `Descrição PCD: ${server.pcdDescricao}\n`;
      details += `\n`;

      details += `Filiação:\n`;
      details += `Nome da Mãe: ${server.nomeMae}\n`;
      if (server.nomePai) details += `Nome do Pai: ${server.nomePai}\n`;
      details += `\n`;

      details += "CONTATO\n";
      details += `Telefone Principal: ${server.telefonePrincipal}\n`;
      if (server.telefoneSecundario) details += `Telefone Secundário: ${server.telefoneSecundario}\n`;
      if(server.emailPessoal) details += `E-mail Pessoal: ${server.emailPessoal}\n`;
      details += `Contato de Emergência: ${server.contatoEmergenciaNome} - ${server.contatoEmergenciaTelefone}\n\n`;

      details += "ENDEREÇO\n";
      details += `CEP: ${server.cep}\n`;
      details += `Logradouro: ${server.logradouro}\n`;
      if (server.complemento) details += `Complemento: ${server.complemento}\n`;
      details += `Bairro: ${server.bairro}\n`;
      details += `Cidade/Estado: ${server.cidade}/${server.uf}\n\n`;

      details += "DADOS PROFISSIONAIS\n";
      details += `Vínculo: ${server.vinculo}\n`;
      if (server.matricula) details += `Matrícula: ${server.matricula}\n`;
      details += `Cargo: ${server.cargo}\n`;
      details += `Função: ${server.funcao}\n`;
      details += `Data de Início: ${server.dataInicio}\n`;
      details += `Possui DGA?: ${server.possuiDGA}\n`;
      if (server.especificacaoDGA) details += `Especificação DGA: ${server.especificacaoDGA}\n`;
      details += `Setor: ${server.setor}\n`;
      if(server.ramal) details += `Ramal: ${server.ramal}\n`;
      details += `Jornada: ${server.jornada}\n`;
      details += `Turno: ${server.turno}\n`;
       if(server.outroTurno) details += `Outro Turno: ${server.outroTurno}\n`;
      details += `Status: ${server.status}\n`;
      details += `E-mail Institucional: ${server.emailInstitucional}\n\n`;

      details += "FORMAÇÃO\n";
      details += `Escolaridade: ${server.escolaridade}\n`;
      if(server.instituicaoEnsinoBasico) details += `Instituição: ${server.instituicaoEnsinoBasico}\n`;
      if(server.anoConclusaoEnsinoBasico) details += `Ano de Conclusão: ${server.anoConclusaoEnsinoBasico}\n`;
      if(server.cursoGraduacao) details += `Curso de Graduação: ${server.cursoGraduacao}\n`;
      if(server.instituicaoGraduacao) details += `Instituição da Graduação: ${server.instituicaoGraduacao}\n`;
      if(server.anoConclusaoGrad) details += `Ano de Conclusão (Grad.): ${server.anoConclusaoGrad}\n`;
      if (server.escolaridade === 'pos-graduacao') {
        if(server.tipoPosGraduacao) details += `Tipo de Pós-Graduação: ${server.tipoPosGraduacao}\n`;
        if(server.cursoPosGraduacao) details += `Curso de Pós-Graduação: ${server.cursoPosGraduacao}\n`;
        if(server.instituicaoPosGraduacao) details += `Instituição da Pós-Grad.: ${server.instituicaoPosGraduacao}\n`;
        if(server.anoConclusaoPosGrad) details += `Ano de Conclusão (Pós-Grad.): ${server.anoConclusaoPosGrad}\n`;
      }
      details += `\n`;

      if (server.observacoes) {
        details += "OBSERVAÇÕES\n";
        details += `${server.observacoes}\n`;
      }
      return details.trim();
  };

  const getAllSelectedServersDetails = (forWhatsApp: boolean = false) => {
    return (servers || [])
      .filter(server => selectedServers[server.id])
      .map(server => getSelectedServersDetails(server, forWhatsApp))
      .join('\n\n---\n\n');
  }

  const handleShare = async () => {
    const textToShare = getAllSelectedServersDetails();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ficha de Servidor(es)',
          text: textToShare,
        });
      } catch (error) {
        if (error instanceof DOMException && (error.name === 'AbortError' || error.name === 'NotAllowedError')) {
          // User cancelled the share sheet, do nothing.
        } else {
          console.error('Erro ao compartilhar', error);
          handleCopy();
           toast({
            variant: 'destructive',
            title: 'Compartilhamento não disponível',
            description: 'O conteúdo foi copiado para a área de transferência.',
          });
        }
      }
    } else {
      handleCopy();
      toast({
        title: 'Copiado!',
        description: 'Seu navegador não suporta compartilhamento. O conteúdo foi copiado para a área de transferência.',
      });
    }
  };

  const handleCopy = () => {
    const textToCopy = getAllSelectedServersDetails();
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: 'Copiado!',
        description: 'Os dados do(s) servidor(es) foram copiados.',
      });
    }).catch(err => {
      console.error('Erro ao copiar', err);
      toast({
        variant: 'destructive',
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar os dados.',
      });
    });
  };

  const handleShareWhatsApp = () => {
    const textToShare = getAllSelectedServersDetails(true);
    const encodedText = encodeURIComponent(textToShare);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDeleteSelected = async () => {
    if (!firestore || selectionCount === 0) return;

    const batch = writeBatch(firestore);
    const idsToDelete = Object.keys(selectedServers).filter(id => selectedServers[id]);

    idsToDelete.forEach(id => {
      const docRef = doc(firestore, 'servers', id);
      batch.delete(docRef);
    });

    try {
      await batch.commit();
      toast({
        title: 'Servidores excluídos!',
        description: `${selectionCount} servidor(es) foram removidos com sucesso.`
      });
      setSelectedServers({});
    } catch (error) {
      console.error('Erro ao excluir servidores:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir os servidores selecionados.'
      });
    }
  };

const handleExportPDF = async () => {
    const selected = (servers || []).filter(server => selectedServers[server.id]);
    if (selected.length === 0) return;

    try {
      const { default: jsPDF } = await import('jspdf');

      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 15;
      const cellMargin = 2;
      const col1X = margin;
      const col2X = margin + 50;

      const drawSectionHeader = (y: number, title: string) => {
        doc.setFillColor(26, 115, 232); // Blue color from image
        doc.rect(margin, y - 4, pageWidth - (margin * 2), 8, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(title, margin + cellMargin, y);
        return y + 10;
      };

      const drawRow = (y: number, label: string, value: string) => {
        if (value) {
            doc.setFillColor(248, 249, 250); // Light gray for row background
            doc.rect(margin, y - 5, pageWidth - (margin * 2), 7, 'F');
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(50, 50, 50);
            doc.text(label, col1X + cellMargin, y);
            doc.setFont('helvetica', 'normal');
            doc.text(value, col2X + cellMargin, y);
            return y + 7;
        }
        return y;
      };
      
      const checkAndAddPage = (y: number, spaceNeeded: number) => {
        if (y + spaceNeeded > pageHeight - margin) {
          doc.addPage();
          return margin;
        }
        return y;
      };


      selected.forEach((server, index) => {
        if (index > 0) {
          doc.addPage();
        }

        let y = margin + 5;

        // --- Título Principal ---
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0,0,0);
        doc.text(`Ficha Completa - ${server.nomeCompleto}`, pageWidth / 2, y, { align: 'center' });
        y += 15;

        // --- DADOS PESSOAIS ---
        y = checkAndAddPage(y, 85);
        y = drawSectionHeader(y, 'DADOS PESSOAIS');
        y = drawRow(y, 'Nome Completo', server.nomeCompleto);
        y = drawRow(y, 'Nome Social', server.nomeSocial);
        y = drawRow(y, 'CPF', server.cpf);
        y = drawRow(y, 'RG', server.rg);
        y = drawRow(y, 'Data de Nascimento', server.dataNascimento);
        y = drawRow(y, 'Gênero', server.genero);
        y = drawRow(y, 'Outro Gênero', server.outroGenero);
        y = drawRow(y, 'Cor/Raça', server.corRaca);
        y = drawRow(y, 'Estado Civil', server.estadoCivil);
        y = drawRow(y, 'Nacionalidade', server.nacionalidade);
        y = drawRow(y, 'Naturalidade', server.naturalidade);
        y = drawRow(y, 'PCD', server.isPCD);
        y = drawRow(y, 'Descrição PCD', server.pcdDescricao);
        y += 5;

        y = checkAndAddPage(y, 25);
        y = drawSectionHeader(y, 'FILIAÇÃO');
        y = drawRow(y, 'Nome da Mãe', server.nomeMae);
        y = drawRow(y, 'Nome do Pai', server.nomePai);
        y += 5;


        // --- CONTATO ---
        y = checkAndAddPage(y, 35);
        y = drawSectionHeader(y, 'CONTATO');
        y = drawRow(y, 'Telefone Principal', server.telefonePrincipal);
        y = drawRow(y, 'Telefone Secundário', server.telefoneSecundario);
        y = drawRow(y, 'E-mail Pessoal', server.emailPessoal);
        y = drawRow(y, 'Contato de Emergência', `${server.contatoEmergenciaNome} - ${server.contatoEmergenciaTelefone}`);
        y += 5;
        
        // --- ENDEREÇO ---
        y = checkAndAddPage(y, 45);
        y = drawSectionHeader(y, 'ENDEREÇO');
        y = drawRow(y, 'CEP', server.cep);
        y = drawRow(y, 'Logradouro', server.logradouro);
        y = drawRow(y, 'Complemento', server.complemento);
        y = drawRow(y, 'Bairro', server.bairro);
        y = drawRow(y, 'Cidade/Estado', `${server.cidade}/${server.uf}`);
        y += 5;

        // --- DADOS PROFISSIONAIS ---
        y = checkAndAddPage(y, 100);
        y = drawSectionHeader(y, 'DADOS PROFISSIONAIS');
        y = drawRow(y, 'Vínculo', server.vinculo);
        y = drawRow(y, 'Matrícula', server.matricula);
        y = drawRow(y, 'Cargo', server.cargo);
        y = drawRow(y, 'Função', server.funcao);
        y = drawRow(y, 'Data de Início', server.dataInicio);
        y = drawRow(y, 'Possui DGA?', server.possuiDGA);
        y = drawRow(y, 'Especificação DGA', server.especificacaoDGA);
        y = drawRow(y, 'Setor', server.setor);
        y = drawRow(y, 'Ramal', server.ramal);
        y = drawRow(y, 'Jornada', server.jornada);
        y = drawRow(y, 'Turno', server.turno);
        y = drawRow(y, 'Outro Turno', server.outroTurno);
        y = drawRow(y, 'Status', server.status);
        y = drawRow(y, 'E-mail Institucional', server.emailInstitucional);
        y += 5;

        // --- FORMAÇÃO ---
        y = checkAndAddPage(y, 70);
        y = drawSectionHeader(y, 'FORMAÇÃO');
        y = drawRow(y, 'Escolaridade', server.escolaridade);
        y = drawRow(y, 'Instituição', server.instituicaoEnsinoBasico);
        y = drawRow(y, 'Ano de Conclusão', server.anoConclusaoEnsinoBasico);
        y = drawRow(y, 'Curso de Graduação', server.cursoGraduacao);
        y = drawRow(y, 'Instituição da Graduação', server.instituicaoGraduacao);
        y = drawRow(y, 'Ano de Conclusão (Grad.)', server.anoConclusaoGrad);
        if (server.escolaridade === 'Pós-Graduação') {
          y = drawRow(y, 'Tipo de Pós-Graduação', server.tipoPosGraduacao);
          y = drawRow(y, 'Curso de Pós-Graduação', server.cursoPosGraduacao);
          y = drawRow(y, 'Instituição da Pós-Grad.', server.instituicaoPosGraduacao);
          y = drawRow(y, 'Ano de Conclusão (Pós-Grad.)', server.anoConclusaoPosGrad);
        }
        y += 5;

        // --- OBSERVAÇÕES ---
        y = checkAndAddPage(y, 20);
        y = drawSectionHeader(y, 'OBSERVAÇÕES');
        y = drawRow(y, 'Observações', server.observacoes);

      });

      doc.save(selected.length > 1 ? `servidores.pdf` : `${selected[0].nomeCompleto.replace(/\s/g, '_')}.pdf`);

    } catch (error) {
      console.error('Erro ao exportar PDF', error);
      toast({
        variant: "destructive",
        title: 'Erro ao exportar',
        description: 'Não foi possível exportar como PDF.',
      });
    }
  };

  const handleLongPress = (id: string) => {
    if (isMobile) {
      handleSelectServer(id, !selectedServers[id]);
    }
  };

  const handleClick = (e: React.MouseEvent, serverId: string, color: string) => {
     const url = `/servidores/${serverId}?color=${encodeURIComponent(color)}`;
     if (isMobile) {
        if (selectionCount > 0) {
            e.stopPropagation();
            e.preventDefault();
            handleSelectServer(serverId, !selectedServers[serverId]);
        } else {
            router.push(url);
        }
     } else {
        router.push(url);
     }
  };


const handleOpenShareDialog = async () => {
    if (!firestore) return;

    try {
        const preCadastroRef = await addDoc(collection(firestore, 'preCadastros'), {
            status: 'pending',
            createdAt: serverTimestamp(),
        });
        const link = `${window.location.origin}/pre-cadastro/${preCadastroRef.id}`;
        setPreCadastroLink(link);
        setIsShareDialogOpen(true);
    } catch (error) {
        console.error("Erro ao gerar link de pré-cadastro:", error);
        toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível gerar o link de pré-cadastro.",
        });
    }
};

const handleShareAction = async (shareOption: 'copy' | 'whatsapp' | 'native') => {
    const textToShare = `${customShareMessage}\n${preCadastroLink}`;

    if (shareOption === 'native' && navigator.share) {
        try {
            await navigator.share({
                title: 'Formulário de Pré-Cadastro',
                text: textToShare,
            });
            setIsShareDialogOpen(false);
            return;
        } catch (error) {
            if (!(error instanceof DOMException && error.name === 'AbortError')) {
                console.error("Web Share API error:", error);
                // Fallback to copy if native share fails for other reasons
                await navigator.clipboard.writeText(textToShare);
                toast({
                    title: 'Falha no Compartilhamento',
                    description: 'Link copiado para a área de transferência.',
                });
            }
            return;
        }
    }

    if (shareOption === 'whatsapp') {
        const encodedText = encodeURIComponent(textToShare);
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } else { // 'copy'
        await navigator.clipboard.writeText(textToShare);
        toast({
            title: 'Link copiado!',
            description: 'A mensagem e o link de pré-cadastro foram copiados.',
        });
    }
    setIsShareDialogOpen(false);
};


  return (
    <div className="p-4 space-y-4">
      <header className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">LISTA DE SERVIDORES</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Gerencie os dados e o histórico de todos os servidores.
        </p>
      </header>

      {selectionCount === 0 ? (
        <>
          <div className="grid grid-cols-1 gap-2">
            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Servidor
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                  <DropdownMenuItem onSelect={() => router.push('/servidores/novo')}>
                    <FileSignature className="mr-2 h-4 w-4" />
                    <span>Adicionar Manualmente</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleOpenShareDialog}>
                    <Link2 className="mr-2 h-4 w-4" />
                    <span>Gerar Link de Convite</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Compartilhar Formulário de Cadastro</DialogTitle>
                      <DialogDescription>
                          Envie este link para que novos servidores possam preencher seus próprios dados. O link é de uso único.
                      </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                      <div className="space-y-2">
                          <Label htmlFor="custom-message">Mensagem Personalizada</Label>
                          <Textarea 
                              id="custom-message"
                              value={customShareMessage}
                              onChange={(e) => setCustomShareMessage(e.target.value)}
                              placeholder="Adicione uma mensagem personalizada aqui..."
                              className="bg-muted"
                          />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="pre-cadastro-link">Link de Pré-Cadastro</Label>
                          <Input id="pre-cadastro-link" value={preCadastroLink} readOnly className="bg-muted"/>
                      </div>
                  </div>
                  <DialogFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button variant="outline" onClick={() => handleShareAction('copy')}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar
                      </Button>
                      <Button variant="outline" onClick={() => handleShareAction('whatsapp')}>
                          <WhatsAppIcon className="mr-2 h-4 w-4 text-green-500" />
                          WhatsApp
                      </Button>
                      <Button onClick={() => handleShareAction('native')}>
                          <Share className="mr-2 h-4 w-4" />
                          Mais Opções
                      </Button>
                  </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtrar Servidores</SheetTitle>
                  <SheetDescription>
                    Refine sua busca por status ou tipo de vínculo.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Status</h4>
                    <div className="space-y-2">
                      {statusOptions.map(status => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`filter-status-${status}`} 
                            checked={statusFilters.includes(status)}
                            onCheckedChange={() => handleStatusFilterChange(status)}
                          />
                          <Label htmlFor={`filter-status-${status}`} className="font-normal text-base">{status}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Vínculo</h4>
                     <div className="space-y-2">
                      {vinculoOptions.map(vinculo => (
                        <div key={vinculo} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`filter-vinculo-${vinculo}`} 
                            checked={vinculoFilters.includes(vinculo)}
                            onCheckedChange={() => handleVinculoFilterChange(vinculo)}
                          />
                          <Label htmlFor={`filter-vinculo-${vinculo}`} className="font-normal text-base">{vinculo}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={clearFilters}>Limpar Filtros</Button>
                  <SheetClose asChild>
                    <Button>Aplicar</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            <Button variant="outline" className="w-full" onClick={() => {
                if (filteredServers.length > 0) {
                  handleSelectServer(filteredServers[0].id, true);
                }
            }}>
                <CheckSquare className="mr-2 h-4 w-4" />
                Selecionar
            </Button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Share className="mr-2 h-4 w-4"/>
                  Compartilhar ({selectionCount})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                 <DropdownMenuItem onClick={handleExportPDF}>
                  <FileDown className="mr-2 h-4 w-4" />
                  <span>Exportar como PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareWhatsApp}>
                  <WhatsAppIcon className="mr-2 h-4 w-4" />
                  <span>Compartilhar no WhatsApp</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copiar Texto</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Outras Opções</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4"/>
                    Excluir ({selectionCount})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita. Isso excluirá permanentemente o(s) {selectionCount} servidor(es) selecionado(s).
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSelected}>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading && 
            <div className="flex items-center justify-center p-8">
              <ScrollText className="h-12 w-12 animate-spin text-primary" />
            </div>
          }
          {!isLoading && isMobile ? (
             <div className="space-y-4 p-4">
                {filteredServers.map((server) => {
                   const originalIndex = sortedServers.findIndex(s => s.id === server.id);
                   const colorClass = getServerColor(server, originalIndex);
                   return (
                      <Card
                        key={server.id}
                        className={cn(
                          "cursor-pointer transition-all",
                          colorClass,
                          selectedServers[server.id] && 'border-4 border-primary'
                        )}
                        onClick={(e) => handleClick(e, server.id, colorClass)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            handleLongPress(server.id);
                        }}
                      >
                        <CardContent className="flex items-start gap-4 p-4">
                        <div className="flex flex-col items-center justify-start gap-2 pt-1">
                          <Avatar className="h-12 w-12 mt-2">
                             <AvatarImage src={server.avatarUrl} />
                             <AvatarFallback className="text-lg">{server.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-center gap-1 mt-1">
                            {server.status && (
                              <Badge variant="outline" className={cn("text-xs", getStatusClass(server.status))}>
                                {getStatusIcon(server.status)}
                                {server.status}
                              </Badge>
                            )}
                            <div className={cn("flex items-center text-xs font-semibold", getRatingClass(server.calculatedRating))}>
                              <Award className="w-3 h-3 mr-1 fill-current" />
                              <span>Nota: {server.calculatedRating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 space-y-1 overflow-hidden">
                          <p className="font-semibold">{server.nomeCompleto}</p>
                          <p className="text-sm break-words">{server.emailInstitucional}</p>
                          {server.funcao && (
                            <div className="flex items-center gap-2 text-sm">
                              {getFuncaoIcon(server.funcao)}
                              <span>{server.funcao}</span>
                            </div>
                          )}
                           {server.telefonePrincipal && (
                              <a href={formatWhatsAppLink(server.telefonePrincipal)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 pt-2 text-base" onClick={(e) => e.stopPropagation()}>
                                <WhatsAppIcon className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-blue-500">{server.telefonePrincipal}</span>
                              </a>
                            )}
                        </div>
                        </CardContent>
                      </Card>
                   );
                })}
              </div>
          ) : (
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        id="select-all-desktop"
                        checked={allSelected}
                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                        aria-label="Selecionar todos"
                      />
                    </TableHead>
                    <TableHead className="w-[350px]">
                      Servidor
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead className="text-right pr-4">Telefone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServers.map((server) => {
                    const originalIndex = sortedServers.findIndex(s => s.id === server.id);
                    const colorClass = getServerColor(server, originalIndex);
                    return (
                      <TableRow 
                        key={server.id} 
                        className={cn("cursor-pointer", colorClass)}
                        onClick={(e) => {
                            const target = e.target as HTMLElement;
                            if (target.tagName.toLowerCase() === 'a' || target.closest('a')) {
                                return;
                            }
                            if (selectionCount > 0) {
                              e.stopPropagation();
                              handleSelectServer(server.id, !selectedServers[server.id]);
                            } else {
                              router.push(`/servidores/${server.id}?color=${encodeURIComponent(colorClass)}`);
                            }
                        }}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              id={`server-desktop-${server.id}`}
                              aria-label={`Selecionar ${server.nomeCompleto}`}
                              checked={selectedServers[server.id] || false}
                              onCheckedChange={(checked) => handleSelectServer(server.id, checked as boolean)}
                            />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={server.avatarUrl} />
                                    <AvatarFallback className="text-lg">{server.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{server.nomeCompleto}</p>
                                    <p className="text-sm break-all">{server.emailInstitucional}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(getStatusClass(server.status))}>
                              {getStatusIcon(server.status)}
                              {server.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className={cn("flex items-center font-semibold", getRatingClass(server.calculatedRating))}>
                              <Award className="w-3 h-3 mr-1 fill-current" />
                              <span>{server.calculatedRating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                             {getFuncaoIcon(server.funcao)}
                            <span>{server.funcao}</span>
                          </div>
                        </TableCell>
                         <TableCell className="text-right pr-4 whitespace-nowrap">
                           <a href={formatWhatsAppLink(server.telefonePrincipal)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base justify-end" onClick={(e) => e.stopPropagation()}>
                              <WhatsAppIcon className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-blue-500">{server.telefonePrincipal}</span>
                          </a>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
