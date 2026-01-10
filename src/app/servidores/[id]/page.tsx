

'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Mail, Type, Building, Edit, Trash2, Award, CheckCircle, User, Heart, Home, Briefcase, GraduationCap, Info, CalendarX, PlusCircle, MoreHorizontal, KeyRound, AlertCircle, MinusCircle, FileText, Users, ScrollText, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { useParams, useSearchParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, addDoc, deleteDoc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { useState, useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    avatarUrl?: string;
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
  type: string;
  reason: string;
}

type Feria = {
  id: string;
  startDate: string;
  endDate: string;
  periodoAquisitivo: string;
};

type FeriasPeriodo = {
  startDia: string;
  startMes: string;
  startAno: string;
  endDia: string;
  endMes: string;
  endAno: string;
};

export default function ServerProfilePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const { id } = params;
    const color = searchParams.get('color') || 'bg-card';
    const firestore = useFirestore();
    const { toast } = useToast();

    // State for Faltas
    const [isFaltaDialogOpen, setIsFaltaDialogOpen] = useState(false);
    const [faltaReason, setFaltaReason] = useState('');
    const [faltaDia, setFaltaDia] = useState('');
    const [faltaMes, setFaltaMes] = useState('');
    const [faltaAno, setFaltaAno] = useState('');
    const [selectedFaltaYear, setSelectedFaltaYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedFaltaMonth, setSelectedFaltaMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [editingFalta, setEditingFalta] = useState<Falta | null>(null);

    // State for Licenças
    const [isLicencaDialogOpen, setIsLicencaDialogOpen] = useState(false);
    const [licencaType, setLicencaType] = useState('');
    const [licencaReason, setLicencaReason] = useState('');
    const [selectedLicencaYear, setSelectedLicencaYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedLicencaMonth, setSelectedLicencaMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [licencaStartDia, setLicencaStartDia] = useState('');
    const [licencaStartMes, setLicencaStartMes] = useState('');
    const [licencaStartAno, setLicencaStartAno] = useState('');
    const [licencaEndDia, setLicencaEndDia] = useState('');
    const [licencaEndMes, setLicencaEndMes] = useState('');
    const [licencaEndAno, setLicencaEndAno] = useState('');
    const [editingLicenca, setEditingLicenca] = useState<Licenca | null>(null);

    // State for Ferias
    const [isFeriaDialogOpen, setIsFeriaDialogOpen] = useState(false);
    const [feriaPeriodoAquisitivo, setFeriaPeriodoAquisitivo] = useState('');
    const [selectedFeriaYear, setSelectedFeriaYear] = useState<string>(new Date().getFullYear().toString());
    const [editingFeria, setEditingFeria] = useState<Feria | null>(null);
    const [feriasParcelamento, setFeriasParcelamento] = useState('30d');
    const [feriasPeriodos, setFeriasPeriodos] = useState<FeriasPeriodo[]>([
        { startDia: '', startMes: '', startAno: '', endDia: '', endMes: '', endAno: '' }
    ]);
    const [selectedFeriaMonth, setSelectedFeriaMonth] = useState<string>((new Date().getMonth() + 1).toString());

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

    const feriasQuery = useMemoFirebase(() => {
      if (!firestore || !id) return null;
      return collection(firestore, 'servers', id as string, 'ferias');
    }, [firestore, id]);


    const { data: server, isLoading: isLoadingServer } = useDoc<Server>(serverRef);
    const { data: faltas, isLoading: isLoadingFaltas } = useCollection<Falta>(faltasQuery);
    const { data: licencas, isLoading: isLoadingLicencas } = useCollection<Licenca>(licencasQuery);
    const { data: ferias, isLoading: isLoadingFerias } = useCollection<Feria>(feriasQuery);

    const resetFaltaForm = () => {
        setFaltaDia('');
        setFaltaMes('');
        setFaltaAno('');
        setFaltaReason('');
        setEditingFalta(null);
    };

    const resetLicencaForm = () => {
        setLicencaStartDia('');
        setLicencaStartMes('');
        setLicencaStartAno('');
        setLicencaEndDia('');
        setLicencaEndMes('');
        setLicencaEndAno('');
        setLicencaReason('');
        setLicencaType('');
        setEditingLicenca(null);
    };

    const resetFeriaForm = () => {
        setFeriasPeriodos([{ startDia: '', startMes: '', startAno: '', endDia: '', endMes: '', endAno: '' }]);
        setFeriaPeriodoAquisitivo('');
        setFeriasParcelamento('30d');
        setEditingFeria(null);
    };

    useEffect(() => {
        if (isFaltaDialogOpen) {
            if (editingFalta) {
                const [day, month, year] = editingFalta.date.split('/');
                setFaltaDia(day);
                setFaltaMes(month);
                setFaltaAno(year);
                setFaltaReason(editingFalta.reason);
            } else {
                resetFaltaForm();
            }
        } else {
            resetFaltaForm();
        }
    }, [isFaltaDialogOpen, editingFalta]);

    useEffect(() => {
        if (isLicencaDialogOpen) {
            if (editingLicenca) {
                const [startDay, startMonth, startYear] = editingLicenca.startDate.split('/');
                const [endDay, endMonth, endYear] = editingLicenca.endDate.split('/');
                setLicencaStartDia(startDay);
                setLicencaStartMes(startMonth);
                setLicencaStartAno(startYear);
                setLicencaEndDia(endDay);
                setLicencaEndMes(endMonth);
                setLicencaEndAno(endYear);
                setLicencaType(editingLicenca.type);
                setLicencaReason(editingLicenca.reason);
            } else {
                resetLicencaForm();
            }
        } else {
            resetLicencaForm();
        }
    }, [isLicencaDialogOpen, editingLicenca]);
    
     useEffect(() => {
        if (isFeriaDialogOpen) {
            if (editingFeria) {
                 const [startDay, startMonth, startYear] = editingFeria.startDate.split('/');
                const [endDay, endMonth, endYear] = editingFeria.endDate.split('/');
                setFeriasPeriodos([{
                    startDia: startDay, startMes: startMonth, startAno: startYear,
                    endDia: endDay, endMes: endMonth, endAno: endYear
                }]);
                setFeriaPeriodoAquisitivo(editingFeria.periodoAquisitivo);
                setFeriasParcelamento('edit'); // Special mode for editing
            } else {
                resetFeriaForm();
            }
        } else {
            resetFeriaForm();
        }
    }, [isFeriaDialogOpen, editingFeria]);

    useEffect(() => {
        if (editingFeria) return; // Don't change periods when editing
        
        if (feriasParcelamento === 'custom') {
            setFeriasPeriodos([]);
            return;
        }

        let numPeriodos = 1;
        if (feriasParcelamento === '15d') numPeriodos = 2;
        if (feriasParcelamento === '10d') numPeriodos = 3;
        
        const newPeriodos = Array.from({ length: numPeriodos }, () => ({
            startDia: '', startMes: '', startAno: '', endDia: '', endMes: '', endAno: ''
        }));
        setFeriasPeriodos(newPeriodos);

    }, [feriasParcelamento, editingFeria]);

     const handleFeriasPeriodoChange = (index: number, field: keyof FeriasPeriodo, value: string) => {
        const newPeriodos = [...feriasPeriodos];
        newPeriodos[index][field] = value;
        setFeriasPeriodos(newPeriodos);
    };

    const addFeriasPeriodo = () => {
        setFeriasPeriodos([...feriasPeriodos, { startDia: '', startMes: '', startAno: '', endDia: '', endMes: '', endAno: '' }]);
    };

    const removeFeriasPeriodo = (index: number) => {
        if (feriasPeriodos.length > 1) {
            const newPeriodos = feriasPeriodos.filter((_, i) => i !== index);
            setFeriasPeriodos(newPeriodos);
        }
    };


    const handleSaveFalta = async () => {
        const dia = parseInt(faltaDia, 10);
        const mes = parseInt(faltaMes, 10);
        const ano = parseInt(faltaAno, 10);

        if (!firestore || !id || !dia || !mes || !ano || dia > 31 || mes > 12 || ano < 2000) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Data inválida. Por favor, verifique os campos.' });
            return;
        }

        const dataCompleta = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
        const faltaPayload = { date: dataCompleta, reason: faltaReason, updatedAt: serverTimestamp() };

        try {
             if (editingFalta) {
                const faltaDocRef = doc(firestore, 'servers', id as string, 'faltas', editingFalta.id);
                await setDoc(faltaDocRef, faltaPayload, { merge: true });
                toast({ title: 'Sucesso', description: 'Falta atualizada com sucesso.' });
            } else {
                const faltasCollectionRef = collection(firestore, 'servers', id as string, 'faltas');
                await addDoc(faltasCollectionRef, { ...faltaPayload, createdAt: serverTimestamp() });
                toast({ title: 'Sucesso', description: 'Falta registrada com sucesso.' });
            }
            
            setIsFaltaDialogOpen(false);
        } catch (error) {
            console.error("Erro ao salvar falta:", error);
            toast({ variant: 'destructive', title: 'Erro', description: `Não foi possível ${editingFalta ? 'atualizar' : 'registrar'} a falta.` });
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
    
    const handleSaveLicenca = async () => {
        const startDia = parseInt(licencaStartDia, 10);
        const startMes = parseInt(licencaStartMes, 10);
        const startAno = parseInt(licencaStartAno, 10);
        const endDia = parseInt(licencaEndDia, 10);
        const endMes = parseInt(licencaEndMes, 10);
        const endAno = parseInt(licencaEndAno, 10);

        if (!firestore || !id || !licencaType || 
            !startDia || !startMes || !startAno || startDia > 31 || startMes > 12 || startAno < 2000 ||
            !endDia || !endMes || !endAno || endDia > 31 || endMes > 12 || endAno < 2000
        ) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Tipo de licença e datas são obrigatórios e devem ser válidos.' });
            return;
        }
        
        const licencaStartDate = `${String(startDia).padStart(2, '0')}/${String(startMes).padStart(2, '0')}/${startAno}`;
        const licencaEndDate = `${String(endDia).padStart(2, '0')}/${String(endMes).padStart(2, '0')}/${endAno}`;
        const finalReason = licencaType === 'outro' ? licencaReason : licencaReason;

        const licencaPayload = {
            startDate: licencaStartDate,
            endDate: licencaEndDate,
            type: licencaType,
            reason: finalReason,
            updatedAt: serverTimestamp(),
        };

        try {
            if (editingLicenca) {
                const licencaDocRef = doc(firestore, 'servers', id as string, 'licencas', editingLicenca.id);
                await setDoc(licencaDocRef, licencaPayload, { merge: true });
                toast({ title: 'Sucesso', description: 'Licença atualizada com sucesso.' });
            } else {
                const licencasCollectionRef = collection(firestore, 'servers', id as string, 'licencas');
                await addDoc(licencasCollectionRef, { ...licencaPayload, createdAt: serverTimestamp() });
                toast({ title: 'Sucesso', description: 'Licença registrada com sucesso.' });
            }
            setIsLicencaDialogOpen(false);
        } catch (error) {
            console.error("Erro ao registrar licença:", error);
            toast({ variant: 'destructive', title: 'Erro', description: `Não foi possível ${editingLicenca ? 'atualizar' : 'registrar'} a licença.` });
        }
    };

    const handleDeleteLicenca = async (licencaId: string) => {
      if (!firestore || !id || !licencaId) return;
      try {
        const licencaDocRef = doc(firestore, 'servers', id as string, 'licencas', licencaId);
        await deleteDoc(licencaDocRef);
        toast({ title: 'Sucesso', description: 'Licença removida com sucesso.' });
      } catch (error) {
        console.error("Erro ao remover licença:", error);
        toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível remover a licença.' });
      }
    };

    const handleSaveFeria = async () => {
        if (!firestore || !id || !feriaPeriodoAquisitivo) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Período aquisitivo é obrigatório.' });
            return;
        }

        // Handle editing a single vacation period
        if (editingFeria) {
            const periodo = feriasPeriodos[0];
            const startDia = parseInt(periodo.startDia, 10);
            const startMes = parseInt(periodo.startMes, 10);
            const startAno = parseInt(periodo.startAno, 10);
            const endDia = parseInt(periodo.endDia, 10);
            const endMes = parseInt(periodo.endMes, 10);
            const endAno = parseInt(periodo.endAno, 10);

            if (!startDia || !startMes || !startAno || !endDia || !endMes || !endAno) {
                toast({ variant: 'destructive', title: 'Erro', description: 'Todas as datas do período de férias devem ser preenchidas.' });
                return;
            }

            const feriaPayload = {
                startDate: `${String(startDia).padStart(2, '0')}/${String(startMes).padStart(2, '0')}/${startAno}`,
                endDate: `${String(endDia).padStart(2, '0')}/${String(endMes).padStart(2, '0')}/${endAno}`,
                periodoAquisitivo: feriaPeriodoAquisitivo,
                updatedAt: serverTimestamp(),
            };
            
            try {
                const feriaDocRef = doc(firestore, 'servers', id as string, 'ferias', editingFeria.id);
                await setDoc(feriaDocRef, feriaPayload, { merge: true });
                toast({ title: 'Sucesso', description: 'Férias atualizadas com sucesso.' });
                setIsFeriaDialogOpen(false);
            } catch (error) {
                 console.error("Erro ao atualizar férias:", error);
                toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível atualizar as férias.' });
            }
            return;
        }


        // Handle adding new vacation periods (potentially multiple)
        const batch = writeBatch(firestore);
        
        for (const periodo of feriasPeriodos) {
            const startDia = parseInt(periodo.startDia, 10);
            const startMes = parseInt(periodo.startMes, 10);
            const startAno = parseInt(periodo.startAno, 10);
            const endDia = parseInt(periodo.endDia, 10);
            const endMes = parseInt(periodo.endMes, 10);
            const endAno = parseInt(periodo.endAno, 10);

            if (!startDia || !startMes || !startAno || !endDia || !endMes || !endAno) {
                toast({ variant: 'destructive', title: 'Erro', description: 'Todas as datas dos períodos de férias devem ser preenchidas.' });
                return; // Stop the whole batch if one is invalid
            }

            const feriaPayload = {
                startDate: `${String(startDia).padStart(2, '0')}/${String(startMes).padStart(2, '0')}/${startAno}`,
                endDate: `${String(endDia).padStart(2, '0')}/${String(endMes).padStart(2, '0')}/${endAno}`,
                periodoAquisitivo: feriaPeriodoAquisitivo,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const newFeriaRef = doc(collection(firestore, 'servers', id as string, 'ferias'));
            batch.set(newFeriaRef, feriaPayload);
        }

        try {
            await batch.commit();
            toast({ title: 'Sucesso', description: 'Período(s) de férias registrado(s) com sucesso.' });
            setIsFeriaDialogOpen(false);
        } catch (error) {
            console.error("Erro ao registrar férias em lote:", error);
            toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível registrar os períodos de férias.' });
        }
    };


    const handleDeleteFeria = async (feriaId: string) => {
        if (!firestore || !id || !feriaId) return;
        try {
            const feriaDocRef = doc(firestore, 'servers', id as string, 'ferias', feriaId);
            await deleteDoc(feriaDocRef);
            toast({ title: 'Sucesso', description: 'Registro de férias removido com sucesso.' });
        } catch (error) {
            console.error("Erro ao remover férias:", error);
            toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível remover o registro de férias.' });
        }
    };


    const filteredFaltas = useMemo(() => {
        if (!faltas) return [];
        return faltas.filter(falta => {
            const [day, month, year] = falta.date.split('/');
            return year === selectedFaltaYear && month === selectedFaltaMonth.padStart(2, '0');
        });
    }, [faltas, selectedFaltaYear, selectedFaltaMonth]);
    
    const filteredLicencas = useMemo(() => {
      if (!licencas) return [];
      return licencas.filter(licenca => {
          const [startDay, startMonth, startYear] = licenca.startDate.split('/');
          const licenseStartDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
          
          return licenseStartDate.getFullYear().toString() === selectedLicencaYear && 
                 (licenseStartDate.getMonth() + 1).toString().padStart(2, '0') === selectedLicencaMonth.padStart(2, '0');
      });
    }, [licencas, selectedLicencaYear, selectedLicencaMonth]);

    const filteredFerias = useMemo(() => {
      if (!ferias) return [];
      return ferias.filter(feria => {
          const [startDay, startMonth, startYear] = feria.startDate.split('/');
          return startYear === selectedFeriaYear && startMonth === selectedFeriaMonth.padStart(2, '0');
      });
    }, [ferias, selectedFeriaYear, selectedFeriaMonth]);


    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
            years.push(i.toString());
        }
        return years;
    }, []);

    const monthOptions = [
        { value: '1', label: 'Janeiro' }, { value: '2', label: 'Fevereiro' },
        { value: '3', label: 'Março' }, { value: '4', label: 'Abril' },
        { value: '5', label: 'Maio' }, { value: '6', label: 'Junho' },
        { value: '7', label: 'Julho' }, { value: '8', label: 'Agosto' },
        { value: '9', label: 'Setembro' }, { value: '10', label: 'Outubro' },
        { value: '11', label: 'Novembro' }, { value: '12', label: 'Dezembro' }
    ];


    const calculatedRating = useMemo(() => {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const faltasThisMonth = (faltas ?? []).filter(f => {
        const [, month, year] = f.date.split('/');
        return parseInt(month, 10) === currentMonth && parseInt(year, 10) === currentYear;
      }).length;

      const licencasThisMonth = (licencas ?? []).filter(l => {
        const [, month, year] = l.startDate.split('/');
        return parseInt(month, 10) === currentMonth && parseInt(year, 10) === currentYear;
      }).length;

      return 10 - (faltasThisMonth * 1) - (licencasThisMonth * 0.5);
    }, [faltas, licencas]);


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
    if (rating >= 8) return 'text-green-500';
    if (rating >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusClass = (status: string) => {
    if (status === 'Ativo') return 'bg-green-500/20 text-green-300 border-green-500/50';
    if (status === 'Licença') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
    return 'bg-red-500/20 text-red-300 border-red-500/50';
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

  const isLoading = isLoadingServer || isLoadingFaltas || isLoadingLicencas || isLoadingFerias;

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

      <Card className={cn(color)}>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Link href={`/servidores/novo?id=${id}`}>
              <Avatar className="h-24 w-24 cursor-pointer">
                <AvatarImage src={server.avatarUrl} />
                <AvatarFallback className="text-4xl text-black">
                  {server.initials}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h2 className="text-2xl font-bold dark:text-white text-black">{server.nomeCompleto}</h2>
              <p className="dark:text-white/80 text-black/80">{server.cargo}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={cn("font-semibold", getStatusClass(server.status))}>
                {getStatusIcon(server.status)}
                {server.status}
              </Badge>
              <Badge variant="outline" className={cn("font-semibold border-border", getRatingClass(calculatedRating))}>
                <Award className="h-3 w-3 mr-1" />
                Nota: {calculatedRating.toFixed(1)}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 dark:text-white/80 text-black/80" />
              <span className="text-sm dark:text-white text-black">{server.emailInstitucional}</span>
            </div>
            <a href={formatWhatsAppLink(server.telefonePrincipal)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-base">
              <WhatsAppIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-blue-500">{server.telefonePrincipal}</span>
            </a>
            <div className="flex items-center gap-4">
              <Type className="h-5 w-5 dark:text-white/80 text-black/80" />
              <span className="text-sm dark:text-white text-black">{server.vinculo}</span>
            </div>
            <div className="flex items-center gap-4">
              <Building className="h-5 w-5 dark:text-white/80 text-black/80" />
              <span className="text-sm dark:text-white text-black">{server.setor}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" asChild className="dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 dark:text-white bg-black/10 hover:bg-black/20 border-black/20 text-black">
              <Link href={`/servidores/novo?id=${id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Link>
            </Button>
            <Button variant="destructive" className="bg-red-500/80 hover:bg-red-500">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {server && (
        <Tabs defaultValue="ficha" className="w-full flex-1 flex flex-col rounded-lg">
           <TabsList className="h-auto items-center justify-center rounded-md p-1 flex flex-wrap w-full text-foreground bg-muted md:grid md:grid-cols-4 border">
              <TabsTrigger value="ficha" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Ficha</TabsTrigger>
              <TabsTrigger value="faltas" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Faltas</TabsTrigger>
              <TabsTrigger value="licencas" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Licenças</TabsTrigger>
              <TabsTrigger value="ferias" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Férias</TabsTrigger>
            </TabsList>
          <TabsContent value="ficha" className="mt-0 flex-1 flex flex-col md:mt-0 p-2 bg-background border border-t-0 rounded-b-lg">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {fichaItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border border rounded-lg bg-background">
                  <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{item.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0">
                    <div className="space-y-2">
                      {item.content.map((detail, detailIndex) => (detail.value) && (
                        <div key={detailIndex} className="flex justify-between items-center text-sm p-2 bg-muted rounded-md">
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
          <TabsContent value="faltas" className="mt-0 flex flex-col flex-1 md:mt-0 bg-background border border-t-0 rounded-b-lg">
            <Card className="bg-transparent shadow-none border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarX className="h-6 w-6" />
                  <CardTitle className="text-lg">Faltas</CardTitle>
                </div>
                 <Dialog open={isFaltaDialogOpen} onOpenChange={setIsFaltaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setEditingFalta(null)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adicionar Falta
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background">
                    <DialogHeader>
                      <DialogTitle>{editingFalta ? 'Editar Falta' : 'Registrar Nova Falta'}</DialogTitle>
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
                              className="bg-muted"
                            />
                             <Input
                              type="number"
                              placeholder="Mês"
                              value={faltaMes}
                              onChange={(e) => setFaltaMes(e.target.value)}
                              maxLength={2}
                              className="bg-muted"
                            />
                             <Input
                              type="number"
                              placeholder="Ano"
                              value={faltaAno}
                              onChange={(e) => setFaltaAno(e.target.value)}
                              maxLength={4}
                              className="bg-muted"
                            />
                          </div>
                       </div>
                      <div className="space-y-2">
                        <Label htmlFor="falta-reason">Descrição</Label>
                        <Textarea
                          id="falta-reason"
                          placeholder="Adicione uma descrição ou observação..."
                          value={faltaReason}
                          onChange={(e) => setFaltaReason(e.target.value)}
                          className="bg-muted"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setIsFaltaDialogOpen(false)}>Cancelar</Button>
                      <Button onClick={handleSaveFalta}>Salvar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <Select value={selectedFaltaYear} onValueChange={setSelectedFaltaYear}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o Ano" />
                        </SelectTrigger>
                        <SelectContent>
                            {yearOptions.map(year => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedFaltaMonth} onValueChange={setSelectedFaltaMonth}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o Mês" />
                        </SelectTrigger>
                        <SelectContent>
                            {monthOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isLoadingFaltas ? <p>Carregando faltas...</p> : (filteredFaltas && filteredFaltas.length > 0) ? (
                  <Table>
                    <TableHeader className="hidden md:table-header-group">
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFaltas.map((falta) => (
                        <TableRow key={falta.id} className="flex flex-col md:table-row p-4 md:p-0 border-b last:border-b-0 md:border-b">
                          <TableCell className="font-medium p-0 md:p-4">
                            <span className="md:hidden font-semibold">Data: </span>{falta.date}
                          </TableCell>
                          <TableCell className="text-muted-foreground p-0 md:p-4">
                             <span className="md:hidden font-semibold text-foreground">Descrição: </span>{falta.reason || 'Sem justificativa'}
                          </TableCell>
                          <TableCell className="p-0 md:p-4 mt-2 md:mt-0 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setEditingFalta(falta); setIsFaltaDialogOpen(true); }}>
                                  <Edit className="h-5 w-5" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 hover:text-red-500">
                                      <Trash2 className="h-5 w-5" />
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
                                      <AlertDialogAction onClick={() => handleDeleteFalta(falta.id)} className="bg-red-600 hover:bg-red-700">
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-4">Nenhuma falta registrada para este período.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="licencas" className="mt-0 flex flex-col flex-1 md:mt-0 bg-background border border-t-0 rounded-b-lg">
             <Card className="bg-transparent shadow-none border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarX className="h-6 w-6" />
                  <CardTitle className="text-lg">Licenças</CardTitle>
                </div>
                 <Dialog open={isLicencaDialogOpen} onOpenChange={setIsLicencaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setEditingLicenca(null)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adicionar Licença
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background">
                    <DialogHeader>
                      <DialogTitle>{editingLicenca ? 'Editar Licença' : 'Registrar Nova Licença'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                       <div className="space-y-2">
                            <Label htmlFor="licenca-type">Tipo de Licença</Label>
                            <Select value={licencaType} onValueChange={setLicencaType}>
                                <SelectTrigger id="licenca-type" className="bg-muted">
                                    <SelectValue placeholder="Selecione o tipo..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Médica">Médica</SelectItem>
                                    <SelectItem value="Capacitação">Capacitação</SelectItem>
                                    <SelectItem value="TIP">TIP</SelectItem>
                                    <SelectItem value="Maternidade">Maternidade</SelectItem>
                                    <SelectItem value="Paternidade">Paternidade</SelectItem>
                                    <SelectItem value="Gala">Gala</SelectItem>
                                    <SelectItem value="Nojo">Nojo</SelectItem>
                                    <SelectItem value="Eleitoral">Eleitoral</SelectItem>
                                    <SelectItem value="outro">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {licencaType === 'outro' && (
                            <div className="space-y-2">
                                <Label htmlFor="licenca-outro-reason">Descrição do Tipo</Label>
                                <Textarea
                                    id="licenca-outro-reason"
                                    placeholder="Descreva o tipo de licença..."
                                    value={licencaReason}
                                    onChange={(e) => setLicencaReason(e.target.value)}
                                    className="bg-muted"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Data de Início</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <Input type="number" placeholder="Dia" value={licencaStartDia} onChange={(e) => setLicencaStartDia(e.target.value)} maxLength={2} className="bg-muted" />
                                <Input type="number" placeholder="Mês" value={licencaStartMes} onChange={(e) => setLicencaStartMes(e.target.value)} maxLength={2} className="bg-muted" />
                                <Input type="number" placeholder="Ano" value={licencaStartAno} onChange={(e) => setLicencaStartAno(e.target.value)} maxLength={4} className="bg-muted" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Data de Fim</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <Input type="number" placeholder="Dia" value={licencaEndDia} onChange={(e) => setLicencaEndDia(e.target.value)} maxLength={2} className="bg-muted" />
                                <Input type="number" placeholder="Mês" value={licencaEndMes} onChange={(e) => setLicencaEndMes(e.target.value)} maxLength={2} className="bg-muted" />
                                <Input type="number" placeholder="Ano" value={licencaEndAno} onChange={(e) => setLicencaEndAno(e.target.value)} maxLength={4} className="bg-muted" />
                            </div>
                        </div>
                       {licencaType !== 'outro' && (
                        <div className="space-y-2">
                            <Label htmlFor="licenca-reason">Descrição</Label>
                            <Textarea
                            id="licenca-reason"
                            placeholder="Adicione uma descrição ou observação..."
                            value={licencaReason}
                            onChange={(e) => setLicencaReason(e.target.value)}
                            className="bg-muted"
                            />
                        </div>
                       )}
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setIsLicencaDialogOpen(false)}>Cancelar</Button>
                      <Button onClick={handleSaveLicenca}>Salvar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                     <Select value={selectedLicencaYear} onValueChange={setSelectedLicencaYear}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o Ano" />
                        </SelectTrigger>
                        <SelectContent>
                            {yearOptions.map(year => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedLicencaMonth} onValueChange={setSelectedLicencaMonth}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o Mês" />
                        </SelectTrigger>
                        <SelectContent>
                            {monthOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isLoadingLicencas ? <p>Carregando licenças...</p> : (filteredLicencas && filteredLicencas.length > 0) ? (
                  <Table>
                    <TableHeader className="hidden md:table-header-group">
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLicencas.map((licenca) => (
                        <TableRow key={licenca.id} className="flex flex-col md:table-row p-4 md:p-0 border-b last:border-b-0 md:border-b">
                           <TableCell className="p-0 md:p-4 font-medium">
                            <span className="md:hidden font-semibold">Tipo: </span>{licenca.type}
                          </TableCell>
                          <TableCell className="p-0 md:p-4">
                            <span className="md:hidden font-semibold">Período: </span>{`${licenca.startDate} - ${licenca.endDate}`}
                          </TableCell>
                          <TableCell className="text-muted-foreground p-0 md:p-4">
                            <span className="md:hidden font-semibold text-foreground">Descrição: </span>{licenca.reason || '-'}
                          </TableCell>
                          <TableCell className="p-0 md:p-4 mt-2 md:mt-0 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setEditingLicenca(licenca); setIsLicencaDialogOpen(true); }}>
                                  <Edit className="h-5 w-5" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 hover:text-red-500">
                                      <Trash2 className="h-5 w-5" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro de licença.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteLicenca(licenca.id)} className="bg-red-600 hover:bg-red-700">
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-4">Nenhuma licença registrada para este período.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ferias" className="mt-0 flex flex-col flex-1 md:mt-0 bg-background border border-t-0 rounded-b-lg">
            <Card className="bg-transparent shadow-none border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-6 w-6" />
                        <CardTitle className="text-lg">Férias</CardTitle>
                    </div>
                    <Dialog open={isFeriaDialogOpen} onOpenChange={setIsFeriaDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setEditingFeria(null)}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Adicionar Férias
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-background sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{editingFeria ? 'Editar Férias' : 'Registrar Novas Férias'}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                                <div className="space-y-2">
                                    <Label htmlFor="feria-periodo-aquisitivo">Período Aquisitivo</Label>
                                    <Input 
                                      id="feria-periodo-aquisitivo" 
                                      placeholder="Ex: 2023/2024"
                                      value={feriaPeriodoAquisitivo}
                                      onChange={(e) => setFeriaPeriodoAquisitivo(e.target.value)}
                                      disabled={!!editingFeria}
                                      className="bg-muted"
                                    />
                                </div>
                                { !editingFeria &&
                                  <div className="space-y-2">
                                      <Label htmlFor="ferias-parcelamento">Parcelamento de Férias</Label>
                                      <Select value={feriasParcelamento} onValueChange={setFeriasParcelamento}>
                                          <SelectTrigger id="ferias-parcelamento" className="bg-muted">
                                              <SelectValue placeholder="Selecione o parcelamento..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                              <SelectItem value="30d">Um período de 30 dias</SelectItem>
                                              <SelectItem value="15d">Dois períodos de 15 dias</SelectItem>
                                              <SelectItem value="10d">Três períodos de 10 dias</SelectItem>
                                              <SelectItem value="custom">Personalizado</SelectItem>
                                          </SelectContent>
                                      </Select>
                                  </div>
                                }
                                
                                {feriasPeriodos.map((periodo, index) => (
                                    <div key={index} className="space-y-3 p-3 border rounded-md relative bg-muted/50">
                                        <Label className="font-semibold">Período {index + 1}</Label>
                                        {feriasParcelamento === 'custom' && feriasPeriodos.length > 1 && !editingFeria && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6"
                                                onClick={() => removeFeriasPeriodo(index)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                        <div className="space-y-2">
                                            <Label className="text-xs">Data de Início</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <Input type="number" placeholder="Dia" value={periodo.startDia} onChange={(e) => handleFeriasPeriodoChange(index, 'startDia', e.target.value)} maxLength={2} className="bg-background"/>
                                                <Input type="number" placeholder="Mês" value={periodo.startMes} onChange={(e) => handleFeriasPeriodoChange(index, 'startMes', e.target.value)} maxLength={2} className="bg-background"/>
                                                <Input type="number" placeholder="Ano" value={periodo.startAno} onChange={(e) => handleFeriasPeriodoChange(index, 'startAno', e.target.value)} maxLength={4} className="bg-background"/>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Data de Fim</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <Input type="number" placeholder="Dia" value={periodo.endDia} onChange={(e) => handleFeriasPeriodoChange(index, 'endDia', e.target.value)} maxLength={2} className="bg-background"/>
                                                <Input type="number" placeholder="Mês" value={periodo.endMes} onChange={(e) => handleFeriasPeriodoChange(index, 'endMes', e.target.value)} maxLength={2} className="bg-background"/>
                                                <Input type="number" placeholder="Ano" value={periodo.endAno} onChange={(e) => handleFeriasPeriodoChange(index, 'endAno', e.target.value)} maxLength={4} className="bg-background"/>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {feriasParcelamento === 'custom' && !editingFeria && (
                                    <Button type="button" variant="outline" size="sm" onClick={addFeriasPeriodo} className="w-full">
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Adicionar Período
                                    </Button>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setIsFeriaDialogOpen(false)}>Cancelar</Button>
                                <Button onClick={handleSaveFeria}>Salvar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <Select value={selectedFeriaYear} onValueChange={setSelectedFeriaYear}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o Ano" />
                            </SelectTrigger>
                            <SelectContent>
                                {yearOptions.map(year => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         <Select value={selectedFeriaMonth} onValueChange={setSelectedFeriaMonth}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o Mês" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {isLoadingFerias ? <p>Carregando férias...</p> : (filteredFerias && filteredFerias.length > 0) ? (
                        <Table>
                            <TableHeader className="hidden md:table-header-group">
                                <TableRow>
                                    <TableHead>Período Aquisitivo</TableHead>
                                    <TableHead>Período de Gozo</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFerias.map((feria) => (
                                    <TableRow key={feria.id} className="flex flex-col md:table-row p-4 md:p-0 border-b last:border-b-0 md:border-b">
                                        <TableCell className="p-0 md:p-4 font-medium">
                                          <span className="md:hidden font-semibold">Período Aquisitivo: </span>{feria.periodoAquisitivo}
                                        </TableCell>
                                        <TableCell className="p-0 md:p-4">
                                            <span className="md:hidden font-semibold">Período de Gozo: </span>{`${feria.startDate} - ${feria.endDate}`}
                                        </TableCell>
                                        <TableCell className="p-0 md:p-4 mt-2 md:mt-0 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => { setEditingFeria(feria); setIsFeriaDialogOpen(true); }}>
                                                    <Edit className="h-5 w-5" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 hover:text-red-500">
                                                            <Trash2 className="h-5 w-5" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro de férias.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteFeria(feria.id)} className="bg-red-600 hover:bg-red-700">
                                                                Excluir
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground py-4">Nenhum registro de férias para este período.</p>
                    )}
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
