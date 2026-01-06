'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, PlusCircle, Filter, Award, MinusCircle, AlertCircle, Briefcase, Code, PenTool, GraduationCap, UserCog, KeyRound, Share, Trash2, FileText, Copy, FileDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { useIsMobile } from '@/hooks/use-mobile';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from "jspdf";
import { useRouter } from 'next/navigation';

const initialServers = [
  {
    "nomeCompleto": "Ana Maria da Silva e Souza",
    "nomeSocial": "Ana",
    "cpf": "111.222.333-44",
    "rg": "11.222.333-4 (SSP/SP)",
    "dataNascimento": "10/08/1985",
    "genero": "Feminino",
    "corRaca": "Parda",
    "estadoCivil": "Casada",
    "nacionalidade": "Brasileira",
    "naturalidade": "São Paulo/SP",
    "pcd": "Não",
    "telefonePrincipal": "(67) 99999-1234",
    "telefoneSecundario": "(67) 98888-1234",
    "emailPessoal": "ana.pessoal@email.com",
    "contatoEmergenciaNome": "Carlos Souza",
    "contatoEmergenciaTelefone": "(67) 97777-1234",
    "cep": "79002-071",
    "logradouro": "Rua 14 de Julho, 1000",
    "complemento": "Apto 101",
    "bairro": "Centro",
    "cidade": "Campo Grande",
    "uf": "MS",
    "vinculo": "Efetivo",
    "matricula": "11966200",
    "cargo": "Gerente de Projetos",
    "funcao": "Gerente de Projetos",
    "dataInicio": "20/05/2010",
    "possuiDGA": "Não",
    "especificacaoDGA": "",
    "setor": "Diretoria",
    "ramal": "7651",
    "jornada": "40h",
    "turno": "Integral",
    "status": "Ativo",
    "emailInstitucional": "ana.silva@exemplo.com",
    "escolaridade": "Pós-Graduação",
    "cursoGraduacao": "Administração",
    "instituicaoGraduacao": "UFMS",
    "anoConclusaoGrad": "2008",
    "tipoPosGraduacao": "MBA",
    "cursoPosGraduacao": "Gestão de Projetos",
    "instituicaoPosGrad": "FGV",
    "anoConclusaoPosGrad": "2012",
    "observacoes": "Excelente líder de equipe.",
    "initials": "AMS",
    "rating": 9.5
  },
  {
    "nomeCompleto": "Bruno Costa",
    "nomeSocial": "Bruno",
    "cpf": "222.333.444-55",
    "rg": "22.333.444-5 (SSP/RJ)",
    "dataNascimento": "15/03/1990",
    "genero": "Masculino",
    "corRaca": "Branca",
    "estadoCivil": "Solteiro",
    "nacionalidade": "Brasileira",
    "naturalidade": "Rio de Janeiro/RJ",
    "pcd": "Não",
    "telefonePrincipal": "(67) 99999-5678",
    "telefoneSecundario": "",
    "emailPessoal": "bruno.pessoal@email.com",
    "contatoEmergenciaNome": "Fernanda Costa",
    "contatoEmergenciaTelefone": "(67) 97777-5678",
    "cep": "79002-072",
    "logradouro": "Rua Afonso Pena, 2000",
    "complemento": "",
    "bairro": "Centro",
    "cidade": "Campo Grande",
    "uf": "MS",
    "vinculo": "Contratado",
    "matricula": "",
    "cargo": "Desenvolvedor Frontend",
    "funcao": "Desenvolvedor Frontend",
    "dataInicio": "01/02/2022",
    "possuiDGA": "Não",
    "especificacaoDGA": "",
    "setor": "Tecnologia da Informação",
    "ramal": "7652",
    "jornada": "40h",
    "turno": "Integral",
    "status": "Ativo",
    "emailInstitucional": "bruno.costa@exemplo.com",
    "escolaridade": "Graduação",
    "cursoGraduacao": "Ciência da Computação",
    "instituicaoGraduacao": "UFRJ",
    "anoConclusaoGrad": "2015",
    "tipoPosGraduacao": "",
    "cursoPosGraduacao": "",
    "instituicaoPosGrad": "",
    "anoConclusaoPosGrad": "",
    "observacoes": "Desenvolvedor talentoso.",
    "initials": "BC",
    "rating": 8.0
  },
  {
    "nomeCompleto": "Carla Dias",
    "nomeSocial": "Carla",
    "cpf": "333.444.555-66",
    "rg": "33.444.555-6 (SSP/BA)",
    "dataNascimento": "25/11/1992",
    "genero": "Feminino",
    "corRaca": "Preta",
    "estadoCivil": "Solteira",
    "nacionalidade": "Brasileira",
    "naturalidade": "Salvador/BA",
    "pcd": "Não",
    "telefonePrincipal": "(67) 99999-4321",
    "telefoneSecundario": "",
    "emailPessoal": "carla.pessoal@email.com",
    "contatoEmergenciaNome": "Pedro Dias",
    "contatoEmergenciaTelefone": "(67) 97777-4321",
    "cep": "79002-073",
    "logradouro": "Rua Barão do Rio Branco, 3000",
    "complemento": "",
    "bairro": "Centro",
    "cidade": "Campo Grande",
    "uf": "MS",
    "vinculo": "Terceirizado",
    "matricula": "",
    "cargo": "Designer UI/UX",
    "funcao": "Designer UI/UX",
    "dataInicio": "10/09/2021",
    "possuiDGA": "Não",
    "especificacaoDGA": "",
    "setor": "Marketing",
    "ramal": "7653",
    "jornada": "30h",
    "turno": "Vespertino",
    "status": "Licença",
    "emailInstitucional": "carla.dias@exemplo.com",
    "escolaridade": "Graduação",
    "cursoGraduacao": "Design Gráfico",
    "instituicaoGraduacao": "UFBA",
    "anoConclusaoGrad": "2016",
    "tipoPosGraduacao": "",
    "cursoPosGraduacao": "",
    "instituicaoPosGrad": "",
    "anoConclusaoPosGrad": "",
    "observacoes": "",
    "initials": "CD",
    "rating": 7.2
  },
  {
    "nomeCompleto": "João Dias",
    "nomeSocial": "João",
    "cpf": "444.555.666-77",
    "rg": "44.555.666-7 (SSP/MS)",
    "dataNascimento": "01/01/2002",
    "genero": "Masculino",
    "corRaca": "Branca",
    "estadoCivil": "Solteiro",
    "nacionalidade": "Brasileira",
    "naturalidade": "Dourados/MS",
    "pcd": "Não",
    "telefonePrincipal": "(67) 98888-4321",
    "telefoneSecundario": "",
    "emailPessoal": "joao.pessoal@email.com",
    "contatoEmergenciaNome": "Maria Dias",
    "contatoEmergenciaTelefone": "(67) 96666-4321",
    "cep": "79800-000",
    "logradouro": "Avenida Marcelino Pires, 4000",
    "complemento": "",
    "bairro": "Centro",
    "cidade": "Dourados",
    "uf": "MS",
    "vinculo": "Contratado",
    "matricula": "",
    "cargo": "Estagiário",
    "funcao": "Estagiário",
    "dataInicio": "15/02/2023",
    "possuiDGA": "Não",
    "especificacaoDGA": "",
    "setor": "Tecnologia da Informação",
    "ramal": "7654",
    "jornada": "20h",
    "turno": "Matutino",
    "status": "Inativo",
    "emailInstitucional": "joao.dias@exemplo.com",
    "escolaridade": "Graduação",
    "cursoGraduacao": "Sistemas de Informação (Cursando)",
    "instituicaoGraduacao": "UEMS",
    "anoConclusaoGrad": "",
    "tipoPosGraduacao": "",
    "cursoPosGraduacao": "",
    "instituicaoPosGrad": "",
    "anoConclusaoPosGrad": "",
    "observacoes": "Contrato finalizado.",
    "initials": "JD",
    "rating": 3.5
  },
  {
    "nomeCompleto": "Lilian Tenório Carvalho",
    "nomeSocial": "Lilian",
    "cpf": "875.950.871-04",
    "rg": "00.102.907-6 (SSP/MS)",
    "dataNascimento": "05/05/1979",
    "genero": "Feminino",
    "corRaca": "Branco",
    "estadoCivil": "União Estável",
    "nacionalidade": "Brasileira",
    "naturalidade": "Cassilandia MS",
    "pcd": "Não",
    "telefonePrincipal": "(67) 98167-2870",
    "telefoneSecundario": "(67) 99850-4484",
    "emailPessoal": "litencarv@icloud.com",
    "contatoEmergenciaNome": "Lucas Nascimento",
    "contatoEmergenciaTelefone": "(67) 99886-3817",
    "cep": "79541-066",
    "logradouro": "R. Joaquim Bernardes de Freitas, 128",
    "complemento": "casa",
    "bairro": "Jardim Minas Gerais",
    "cidade": "Cassilândia",
    "uf": "MS",
    "vinculo": "Efetivo",
    "matricula": "119662021",
    "cargo": "ATNM",
    "funcao": "Assistente administrativo",
    "dataInicio": "15/09/2004",
    "possuiDGA": "Sim",
    "especificacaoDGA": "DGA -S/Gestor Administrativo",
    "setor": "Secretaria da Gerência",
    "ramal": "7650",
    "jornada": "40h",
    "turno": "Integral",
    "status": "Ativo",
    "emailInstitucional": "litencarv@uems.br",
    "escolaridade": "Pós-Graduação",
    "cursoGraduacao": "Letras-Hab. Português/Inglês",
    "instituicaoGraduacao": "UEMS",
    "anoConclusaoGrad": "2002",
    "tipoPosGraduacao": "Especialização",
    "cursoPosGraduacao": "Didática Geral",
    "instituicaoPosGrad": "FIC",
    "anoConclusaoPosGrad": "2017",
    "observacoes": "Boa funcionária",
    "initials": "LTC",
    "rating": 3.2
  },
  {
    "nomeCompleto": "Fernando Gomes",
    "nomeSocial": "Fernando",
    "cpf": "555.666.777-88",
    "rg": "55.666.777-8 (SSP/PR)",
    "dataNascimento": "12/04/1988",
    "genero": "Masculino",
    "corRaca": "Branca",
    "estadoCivil": "Casado",
    "nacionalidade": "Brasileira",
    "naturalidade": "Curitiba/PR",
    "pcd": "Não",
    "telefonePrincipal": "(67) 98888-1111",
    "telefoneSecundario": "",
    "emailPessoal": "fernando.pessoal@email.com",
    "contatoEmergenciaNome": "Juliana Gomes",
    "contatoEmergenciaTelefone": "(67) 95555-1111",
    "cep": "79002-074",
    "logradouro": "Rua Dom Aquino, 5000",
    "complemento": "Apto 502",
    "bairro": "Centro",
    "cidade": "Campo Grande",
    "uf": "MS",
    "vinculo": "Comissionado",
    "matricula": "",
    "cargo": "Desenvolvedor Backend",
    "funcao": "Desenvolvedor Backend",
    "dataInicio": "01/07/2020",
    "possuiDGA": "Sim",
    "especificacaoDGA": "Chefe de Divisão de Tecnologia",
    "setor": "Tecnologia da Informação",
    "ramal": "7655",
    "jornada": "40h",
    "turno": "Integral",
    "status": "Ativo",
    "emailInstitucional": "fernando.gomes@exemplo.com",
    "escolaridade": "Pós-Graduação",
    "cursoGraduacao": "Engenharia de Software",
    "instituicaoGraduacao": "UTFPR",
    "anoConclusaoGrad": "2011",
    "tipoPosGraduacao": "Mestrado",
    "cursoPosGraduacao": "Ciência da Computação",
    "instituicaoPosGrad": "UNICAMP",
    "anoConclusaoPosGrad": "2014",
    "observacoes": "Especialista em microsserviços.",
    "initials": "FG",
    "rating": 8.8
  }
];


const statusOptions = ['Ativo', 'Inativo', 'Licença'];
const vinculoOptions = ['Efetivo', 'Terceirizado', 'Cedido', 'Contratado', 'Comissionado'];


export default function ServerListPage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { toast } = useToast();

  const [servers, setServers] = useState<any[]>([]);
  const [selectedServers, setSelectedServers] = useState<Record<string, boolean>>({});
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [vinculoFilters, setVinculoFilters] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedServers = localStorage.getItem('servers');
      if (storedServers) {
        setServers(JSON.parse(storedServers));
      } else {
        localStorage.setItem('servers', JSON.stringify(initialServers));
        setServers(initialServers);
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      setServers(initialServers);
    }
  }, []);

  servers.sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));

  const selectionCount = Object.values(selectedServers).filter(Boolean).length;

  const handleSelectAll = (checked: boolean) => {
    const newSelectedServers: Record<string, boolean> = {};
    if (checked) {
      filteredServers.forEach(server => {
        newSelectedServers[server.emailInstitucional] = true;
      });
    }
    setSelectedServers(newSelectedServers);
  };

  const handleSelectServer = (email: string, checked: boolean) => {
    setSelectedServers(prev => ({
      ...prev,
      [email]: checked,
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

  const filteredServers = servers.filter(server => {
    const statusMatch = statusFilters.length === 0 || statusFilters.includes(server.status);
    const vinculoMatch = vinculoFilters.length === 0 || vinculoFilters.includes(server.vinculo);
    return statusMatch && vinculoMatch;
  });


  const allSelected = filteredServers.length > 0 && selectionCount === filteredServers.length;


  const getRatingClass = (rating: number) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusClass = (status: string) => {
    if (status === 'Ativo') return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (status === 'Licença') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Ativo') return <KeyRound className="w-3 h-3 mr-1" />;
    if (status === 'Licença') return <AlertCircle className="w-3 h-3 mr-1" />;
    return <MinusCircle className="w-3 h-3 mr-1" />;
  }
  
  const formatWhatsAppLink = (phone: string) => {
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

  const getSelectedServersDetails = (server: (typeof servers)[0], forWhatsApp: boolean = false) => {
    if (forWhatsApp) {
        const underline = '--------------------';
        let details = `*FICHA COMPLETA - ${server.nomeCompleto.toUpperCase()}*\n${underline}\n\n`;

        details += `*DADOS PESSOAIS*\n${underline}\n`;
        details += `*NOME COMPLETO:* ${server.nomeCompleto.toUpperCase()}\n`;
        details += `*NOME SOCIAL:* ${server.nomeSocial.toUpperCase()}\n`;
        details += `*CPF:* ${server.cpf.toUpperCase()}\n`;
        details += `*RG:* ${server.rg.toUpperCase()}\n`;
        details += `*DATA DE NASCIMENTO:* ${server.dataNascimento.toUpperCase()}\n`;
        details += `*GÊNERO:* ${server.genero.toUpperCase()}\n`;
        details += `*COR/RAÇA:* ${server.corRaca.toUpperCase()}\n`;
        details += `*ESTADO CIVIL:* ${server.estadoCivil.toUpperCase()}\n`;
        details += `*NACIONALIDADE:* ${server.nacionalidade.toUpperCase()}\n`;
        details += `*NATURALIDADE:* ${server.naturalidade.toUpperCase()}\n`;
        details += `*PCD:* ${server.pcd.toUpperCase()}\n\n`;

        details += `*CONTATO*\n${underline}\n`;
        details += `*TELEFONE PRINCIPAL:* ${server.telefonePrincipal.toUpperCase()}\n`;
        if (server.telefoneSecundario) details += `*TELEFONE SECUNDÁRIO:* ${server.telefoneSecundario.toUpperCase()}\n`;
        details += `*E-MAIL PESSOAL:* ${server.emailPessoal.toUpperCase()}\n`;
        details += `*CONTATO DE EMERGÊNCIA:* ${server.contatoEmergenciaNome.toUpperCase()} - ${server.contatoEmergenciaTelefone.toUpperCase()}\n\n`;

        details += `*ENDEREÇO*\n${underline}\n`;
        details += `*CEP:* ${server.cep.toUpperCase()}\n`;
        details += `*LOGRADOURO:* ${server.logradouro.toUpperCase()}\n`;
        if (server.complemento) details += `*COMPLEMENTO:* ${server.complemento.toUpperCase()}\n`;
        details += `*BAIRRO:* ${server.bairro.toUpperCase()}\n`;
        details += `*CIDADE/ESTADO:* ${server.cidade.toUpperCase()}/${server.uf.toUpperCase()}\n\n`;

        details += `*DADOS PROFISSIONAIS*\n${underline}\n`;
        details += `*VÍNCULO:* ${server.vinculo.toUpperCase()}\n`;
        if (server.matricula) details += `*MATRÍCULA:* ${server.matricula.toUpperCase()}\n`;
        details += `*CARGO:* ${server.cargo.toUpperCase()}\n`;
        details += `*FUNÇÃO:* ${server.funcao.toUpperCase()}\n`;
        details += `*DATA DE INÍCIO:* ${server.dataInicio.toUpperCase()}\n`;
        details += `*POSSUI DGA?:* ${server.possuiDGA.toUpperCase()}\n`;
        if (server.especificacaoDGA) details += `*ESPECIFICAÇÃO DGA:* ${server.especificacaoDGA.toUpperCase()}\n`;
        details += `*SETOR:* ${server.setor.toUpperCase()}\n`;
        details += `*RAMAL:* ${server.ramal.toUpperCase()}\n`;
        details += `*JORNADA:* ${server.jornada.toUpperCase()}\n`;
        details += `*TURNO:* ${server.turno.toUpperCase()}\n`;
        details += `*STATUS:* ${server.status.toUpperCase()}\n`;
        details += `*E-MAIL INSTITUCIONAL:* ${server.emailInstitucional.toUpperCase()}\n\n`;

        details += `*FORMAÇÃO*\n${underline}\n`;
        details += `*ESCOLARIDADE:* ${server.escolaridade.toUpperCase()}\n`;
        details += `*CURSO DE GRADUAÇÃO:* ${server.cursoGraduacao.toUpperCase()}\n`;
        details += `*INSTITUIÇÃO DA GRADUAÇÃO:* ${server.instituicaoGraduacao.toUpperCase()}\n`;
        details += `*ANO DE CONCLUSÃO (GRAD.):* ${server.anoConclusaoGrad.toUpperCase()}\n`;
        if (server.escolaridade === 'Pós-Graduação') {
            details += `*TIPO DE PÓS-GRADUAÇÃO:* ${server.tipoPosGraduacao.toUpperCase()}\n`;
            details += `*CURSO DE PÓS-GRADUAÇÃO:* ${server.cursoPosGraduacao.toUpperCase()}\n`;
            details += `*INSTITUIÇÃO DA PÓS-GRAD.:* ${server.instituicaoPosGrad.toUpperCase()}\n`;
            details += `*ANO DE CONCLUSÃO (PÓS-GRAD.):* ${server.anoConclusaoPosGrad.toUpperCase()}\n`;
        }
        details += `\n`;

        details += `*OBSERVAÇÕES*\n${underline}\n`;
        details += `${server.observacoes.toUpperCase()}\n`;

        return details.trim();
    }

      let details = `FICHA COMPLETA - ${server.nomeCompleto}\n\n`;

      details += "DADOS PESSOAIS\n";
      details += `Nome Completo: ${server.nomeCompleto}\n`;
      details += `Nome Social: ${server.nomeSocial}\n`;
      details += `CPF: ${server.cpf}\n`;
      details += `RG: ${server.rg}\n`;
      details += `Data de Nascimento: ${server.dataNascimento}\n`;
      details += `Gênero: ${server.genero}\n`;
      details += `Cor/Raça: ${server.corRaca}\n`;
      details += `Estado Civil: ${server.estadoCivil}\n`;
      details += `Nacionalidade: ${server.nacionalidade}\n`;
      details += `Naturalidade: ${server.naturalidade}\n`;
      details += `PCD: ${server.pcd}\n\n`;

      details += "CONTATO\n";
      details += `Telefone Principal: ${server.telefonePrincipal}\n`;
      if (server.telefoneSecundario) details += `Telefone Secundário: ${server.telefoneSecundario}\n`;
      details += `E-mail Pessoal: ${server.emailPessoal}\n`;
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
      details += `Ramal: ${server.ramal}\n`;
      details += `Jornada: ${server.jornada}\n`;
      details += `Turno: ${server.turno}\n`;
      details += `Status: ${server.status}\n`;
      details += `E-mail Institucional: ${server.emailInstitucional}\n\n`;

      details += "FORMAÇÃO\n";
      details += `Escolaridade: ${server.escolaridade}\n`;
      details += `Curso de Graduação: ${server.cursoGraduacao}\n`;
      details += `Instituição da Graduação: ${server.instituicaoGraduacao}\n`;
      details += `Ano de Conclusão (Grad.): ${server.anoConclusaoGrad}\n`;
      if (server.escolaridade === 'Pós-Graduação') {
        details += `Tipo de Pós-Graduação: ${server.tipoPosGraduacao}\n`;
        details += `Curso de Pós-Graduação: ${server.cursoPosGraduacao}\n`;
        details += `Instituição da Pós-Grad.: ${server.instituicaoPosGrad}\n`;
        details += `Ano de Conclusão (Pós-Grad.): ${server.anoConclusaoPosGrad}\n`;
      }
      details += `\n`;

      details += "OBSERVAÇÕES\n";
      details += `${server.observacoes}\n`;

      return details.trim();
  };

  const getAllSelectedServersDetails = (forWhatsApp: boolean = false) => {
    return servers
      .filter(server => selectedServers[server.emailInstitucional])
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

const handleExportPDF = async () => {
    const selected = servers.filter(server => selectedServers[server.emailInstitucional]);
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
        y = checkAndAddPage(y, 65);
        y = drawSectionHeader(y, 'DADOS PESSOAIS');
        y = drawRow(y, 'Nome Completo', server.nomeCompleto);
        y = drawRow(y, 'Nome Social', server.nomeSocial);
        y = drawRow(y, 'CPF', server.cpf);
        y = drawRow(y, 'RG', server.rg);
        y = drawRow(y, 'Data de Nascimento', server.dataNascimento);
        y = drawRow(y, 'Gênero', server.genero);
        y = drawRow(y, 'Cor/Raça', server.corRaca);
        y = drawRow(y, 'Estado Civil', server.estadoCivil);
        y = drawRow(y, 'Nacionalidade', server.nacionalidade);
        y = drawRow(y, 'Naturalidade', server.naturalidade);
        y = drawRow(y, 'PCD', server.pcd);
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
        y = checkAndAddPage(y, 90);
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
        y = drawRow(y, 'Status', server.status);
        y = drawRow(y, 'E-mail Institucional', server.emailInstitucional);
        y += 5;

        // --- FORMAÇÃO ---
        y = checkAndAddPage(y, 70);
        y = drawSectionHeader(y, 'FORMAÇÃO');
        y = drawRow(y, 'Escolaridade', server.escolaridade);
        y = drawRow(y, 'Curso de Graduação', server.cursoGraduacao);
        y = drawRow(y, 'Instituição da Graduação', server.instituicaoGraduacao);
        y = drawRow(y, 'Ano de Conclusão (Grad.)', server.anoConclusaoGrad);
        if (server.escolaridade === 'Pós-Graduação') {
          y = drawRow(y, 'Tipo de Pós-Graduação', server.tipoPosGraduacao);
          y = drawRow(y, 'Curso de Pós-Graduação', server.cursoPosGraduacao);
          y = drawRow(y, 'Instituição da Pós-Grad.', server.instituicaoPosGrad);
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
          <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            <Link href="/servidores/novo">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Novo Servidor
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
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
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Partilhar Formulário
            </Button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-foreground w-full">
                  <Share className="mr-2 h-4 w-4"/>
                  Compartilhar ({selectionCount})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleShare}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Compartilhar como Texto</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareWhatsApp}>
                  <WhatsAppIcon className="mr-2 h-4 w-4" />
                  <span>Compartilhar no WhatsApp</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copiar Texto</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileDown className="mr-2 h-4 w-4" />
                  <span>Exportar como PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4"/>
                Excluir ({selectionCount})
            </Button>
        </div>
      )}


      <Card>
        <CardContent className="p-0">
          {isMobile ? (
            <>
              <div className="flex items-center p-4 border-b">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  aria-label="Selecionar todos"
                />
                <label htmlFor="select-all" className="ml-4 font-medium text-sm">
                  Nome
                </label>
              </div>
              <div className="space-y-4 p-4">
                {filteredServers.map((server) => (
                  <div
                    key={server.emailInstitucional}
                    className="flex items-start gap-4 pb-4 border-b last:border-b-0"
                  >
                    <Checkbox
                      id={`server-${server.emailInstitucional}`}
                      checked={selectedServers[server.emailInstitucional] || false}
                      onCheckedChange={(checked) => handleSelectServer(server.emailInstitucional, checked as boolean)}
                      className="mt-1"
                    />
                     <div 
                      className="flex-1"
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (
                          target.closest('a') ||
                          target.closest('input[type="checkbox"]') ||
                          (target.parentElement && target.parentElement.id.includes(`server-${server.emailInstitucional}`))
                        ) {
                          return;
                        }
                        router.push(`/servidores/${server.emailInstitucional.split('@')[0]}`);
                      }}
                    >
                      <div className="flex flex-col items-center gap-2 float-left mr-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-lg">{server.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-center gap-1">
                          {server.status && (
                            <Badge variant="outline" className={cn("text-xs", getStatusClass(server.status))}>
                              {getStatusIcon(server.status)}
                              {server.status}
                            </Badge>
                          )}
                          {server.rating && (
                            <div className={cn("flex items-center text-xs", getRatingClass(server.rating))}>
                              <Award className="w-3 h-3 mr-1 fill-current" />
                              <span>Nota: {server.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2 cursor-pointer">
                        <p className="font-semibold">{server.nomeCompleto}</p>
                        <p className="text-sm text-muted-foreground">{server.emailInstitucional}</p>
                        {server.funcao && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getFuncaoIcon(server.funcao)}
                            <span>{server.funcao}</span>
                          </div>
                        )}
                        {server.telefonePrincipal && (
                          <a href={formatWhatsAppLink(server.telefonePrincipal)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 pt-1 text-base text-foreground hover:text-primary">
                            <WhatsAppIcon className="h-4 w-4" />
                            <span>{server.telefonePrincipal}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[350px]">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          id="select-all-desktop"
                          checked={allSelected}
                          onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                          aria-label="Selecionar todos"
                        />
                        <span>Servidor</span>
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead className="text-right pr-8">Telefone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServers.map((server) => (
                    <TableRow 
                      key={server.emailInstitucional} 
                      className="cursor-pointer"
                      onClick={(e) => {
                         if (
                          (e.target as HTMLElement).closest('input[type="checkbox"]') ||
                          (e.target as HTMLElement).closest('a')
                        ) {
                          return;
                        }
                        router.push(`/servidores/${server.emailInstitucional.split('@')[0]}`);
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`server-desktop-${server.emailInstitucional}`}
                            checked={selectedServers[server.emailInstitucional] || false}
                            onCheckedChange={(checked) => handleSelectServer(server.emailInstitucional, checked as boolean)}
                          />
                          <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                  <AvatarFallback className="text-lg">{server.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                  <p className="font-semibold">{server.nomeCompleto}</p>
                                  <p className="text-sm text-muted-foreground break-all">{server.emailInstitucional}</p>
                              </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className={cn("w-fit", getStatusClass(server.status))}>
                              {getStatusIcon(server.status)}
                              {server.status}
                          </Badge>
                           <div className={cn("flex items-center text-xs", getRatingClass(server.rating))}>
                              <Award className="w-3 h-3 mr-1 fill-current" />
                              <span>Nota: {server.rating}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           {getFuncaoIcon(server.funcao)}
                          <span>{server.funcao}</span>
                        </div>
                      </TableCell>
                       <TableCell className="text-right pr-8 whitespace-nowrap">
                         <a href={formatWhatsAppLink(server.telefonePrincipal)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base text-foreground hover:text-primary justify-end">
                            <WhatsAppIcon className="h-4 w-4" />
                            <span>{server.telefonePrincipal}</span>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    