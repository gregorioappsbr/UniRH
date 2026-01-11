
'use client';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"
import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form";
import { maskCPF, maskRG, maskCEP, maskPhone, maskDate } from "@/lib/masks"
import { useFirestore } from "@/firebase"
import { collection, addDoc, doc, setDoc, getDocs, query, where, limit } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export default function CadastroServidorPage() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const possuiCNH = watch('possuiCNH', 'nao');
    const genero = watch('genero', '');
    const isPCD = watch('isPCD', 'nao');
    const tipoVinculo = watch('vinculo', '');
    const turno = watch('turno', '');
    const escolaridade = watch('escolaridade', '');

     const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setAvatarPreview(result);
          setValue('avatarUrl', result);
        };
        reader.readAsDataURL(file);
      }
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        if (!firestore) {
            toast({
              variant: "destructive",
              title: `Erro de conexão`,
              description: `Não foi possível conectar ao banco de dados.`,
            });
            setIsSubmitting(false);
            return;
        }
        
        // Safely generate initials or a fallback
        const initials = data.nomeCompleto ? data.nomeCompleto.split(' ').map((n: string) => n[0]).join('').substring(0, 3).toUpperCase() : '?';
        const serverPayload = { ...data, initials };

        try {
            const serversRef = collection(firestore, "servers");

            if (data.cpf) {
                const q = query(serversRef, where("cpf", "==", data.cpf), limit(1));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Update existing server
                    const existingServerDoc = querySnapshot.docs[0];
                    await setDoc(existingServerDoc.ref, serverPayload, { merge: true });
                     toast({
                        title: "Cadastro Atualizado!",
                        description: "Seus dados foram atualizados com sucesso.",
                    });
                } else {
                    // Add new server
                    const newServer = { ...serverPayload, rating: 10, status: 'Ativo' };
                    await addDoc(serversRef, newServer);
                     toast({
                        title: "Cadastro Enviado!",
                        description: "Seu cadastro foi enviado com sucesso.",
                    });
                }
            } else {
                 // Add new server if no CPF
                 const newServer = { ...serverPayload, rating: 10, status: 'Ativo' };
                 await addDoc(serversRef, newServer);
                  toast({
                    title: "Cadastro Enviado!",
                    description: "Seu cadastro foi enviado com sucesso.",
                });
            }
            
            router.push('/servidores/cadastro/sucesso');

        } catch (error) {
          console.error("Erro ao salvar cadastro:", error);
          toast({
              variant: "destructive",
              title: `Erro ao enviar`,
              description: `Não foi possível enviar seu cadastro. Tente novamente.`,
          });
        } finally {
            setIsSubmitting(false);
        }
    };

    const applyMask = (masker: (value: string) => string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = masker(e.target.value);
    };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 h-full flex flex-col w-full max-w-4xl">
        <header className="relative flex flex-col items-center justify-center mb-6 text-center">
          <h1 className="text-3xl font-bold">Formulário de</h1>
          <h2 className="text-3xl font-bold text-primary">Cadastro de Servidor</h2>
        </header>
        <p className="text-center text-muted-foreground mb-6">
            Por favor, preencha todos os campos com atenção para realizar ou atualizar seu cadastro.
        </p>

        <Tabs defaultValue="pessoais" className="w-full flex-1 flex flex-col overflow-hidden">
            <div className="sticky top-0 bg-background z-10">
                <TabsList className="h-auto items-center justify-center rounded-md p-1 flex flex-wrap w-full text-foreground bg-muted md:grid md:grid-cols-4 border">
                    <TabsTrigger value="pessoais" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Dados Pessoais</TabsTrigger>
                    <TabsTrigger value="profissionais" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Dados Profissionais</TabsTrigger>
                    <TabsTrigger value="formacao" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Formação</TabsTrigger>
                    <TabsTrigger value="observacoes" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Observações</TabsTrigger>
                </TabsList>
            </div>
            <div className="border border-t-0 rounded-b-lg p-6 flex-1 overflow-y-auto pb-24 bg-card">
            <TabsContent value="pessoais" className="mt-0">
                <div className="space-y-8">
                <div className="space-y-6 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold">Identificação</h2>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarPreview} />
                        <AvatarFallback className="text-2xl">
                            {watch('nomeCompleto') ? watch('nomeCompleto').split(' ').map((n: string) => n[0]).join('').substring(0, 3).toUpperCase() : '?'}
                        </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-1">
                        <Label htmlFor="avatar-upload">Foto de Perfil</Label>
                        <Input 
                            id="avatar-upload" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleAvatarChange}
                            className="bg-muted file:text-foreground" 
                        />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="nome-completo">Nome Completo</Label>
                        <Input id="nome-completo" placeholder="Ex: João da Silva" {...register("nomeCompleto")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nome-social">Nome Social</Label>
                        <Input id="nome-social" placeholder="Ex: João" {...register("nomeSocial")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cpf" className="flex items-center">
                          CPF <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input 
                            id="cpf" 
                            placeholder="000.000.000-00" 
                            {...register("cpf", { required: "O CPF é obrigatório." })} 
                            onChange={applyMask(maskCPF)} 
                            maxLength={14} 
                            className="bg-muted" 
                        />
                        {errors.cpf && <p className="text-sm text-red-500 mt-1">{errors.cpf.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rg">RG</Label>
                        <Input id="rg" placeholder="00.000.000-0" {...register("rg")} onChange={applyMask(maskRG)} maxLength={12} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="orgao-emissor">Órgão Emissor</Label>
                        <Input id="orgao-emissor" placeholder="Ex: SSP/MS" {...register("orgaoEmissor")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="possui-cnh">Possui CNH?</Label>
                        <Controller
                            name="possuiCNH"
                            control={control}
                            defaultValue="nao"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="possui-cnh" className="bg-muted">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sim">Sim</SelectItem>
                                        <SelectItem value="nao">Não</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    {possuiCNH === 'sim' && (
                        <>
                        <div className="space-y-2">
                            <Label htmlFor="cnh-numero">Número do Registro CNH</Label>
                            <Input id="cnh-numero" placeholder="00000000000" {...register("cnhNumero")} className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cnh-categoria">Categoria CNH</Label>
                            <Controller
                                name="cnhCategoria"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="cnh-categoria" className="bg-muted">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACC">ACC</SelectItem>
                                        <SelectItem value="A">A</SelectItem>
                                        <SelectItem value="A1">A1</SelectItem>
                                        <SelectItem value="B">B</SelectItem>
                                        <SelectItem value="B1">B1</SelectItem>
                                        <SelectItem value="C">C</SelectItem>
                                        <SelectItem value="C1">C1</SelectItem>
                                        <SelectItem value="D">D</SelectItem>
                                        <SelectItem value="D1">D1</SelectItem>
                                        <SelectItem value="BE">BE</SelectItem>
                                        <SelectItem value="CE">CE</SelectItem>
                                        <SelectItem value="C1E">C1E</SelectItem>
                                        <SelectItem value="DE">DE</SelectItem>
                                        <SelectItem value="D1E">D1E</SelectItem>
                                    </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        </>
                    )}
                    <div className="space-y-2 w-[90%] md:w-full">
                        <Label htmlFor="data-nascimento">Data de Nascimento</Label>
                        <Input id="data-nascimento" type="text" placeholder="dd/mm/aaaa" {...register("dataNascimento")} onChange={applyMask(maskDate)} maxLength={10} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="genero">Gênero</Label>
                        <Controller
                            name="genero"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="genero" className="bg-muted">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="masculino">Masculino</SelectItem>
                                    <SelectItem value="feminino">Feminino</SelectItem>
                                    <SelectItem value="nao-binario">Não-binário</SelectItem>
                                    <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
                                    <SelectItem value="outro">Outro</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    {genero === 'outro' && (
                        <div className="space-y-2">
                            <Label htmlFor="outro-genero">Qual?</Label>
                            <Input id="outro-genero" placeholder="Descreva seu gênero" {...register("outroGenero")} className="bg-muted" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="raca-cor">Cor/Raça</Label>
                        <Controller
                            name="corRaca"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="raca-cor" className="bg-muted">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="branca">Branca</SelectItem>
                                    <SelectItem value="preta">Preta</SelectItem>
                                    <SelectItem value="parda">Parda</SelectItem>
                                    <SelectItem value="amarela">Amarela</SelectItem>
                                    <SelectItem value="indigena">Indígena</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="estado-civil">Estado Civil</Label>
                        <Controller
                            name="estadoCivil"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="estado-civil" className="bg-muted">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                                    <SelectItem value="casado">Casado(a)</SelectItem>
                                    <SelectItem value="separado">Separado(a)</SelectItem>
                                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                                    <SelectItem value="uniao-estavel">União Estável</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nacionalidade">Nacionalidade</Label>
                        <Input id="nacionalidade" placeholder="Ex: Brasileiro(a)" {...register("nacionalidade")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="naturalidade">Naturalidade</Label>
                        <Input id="naturalidade" placeholder="Ex: Campo Grande/MS" {...register("naturalidade")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pcd">É PCD?</Label>
                        <Controller
                            name="isPCD"
                            control={control}
                            defaultValue="nao"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="pcd" className="bg-muted">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sim">Sim</SelectItem>
                                    <SelectItem value="nao">Não</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    {isPCD === 'sim' && (
                        <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="pcd-descricao">Descrição</Label>
                        <Textarea id="pcd-descricao" placeholder="Descreva a deficiência..." {...register("pcdDescricao")} className="bg-muted" />
                        </div>
                    )}
                    </div>
                </div>

                <div className="space-y-6 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold">Filiação</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="nome-mae">Nome da Mãe</Label>
                        <Input id="nome-mae" placeholder="Ex: Maria da Silva" {...register("nomeMae")} className="bg-muted" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="nome-pai">Nome do Pai</Label>
                        <Input id="nome-pai" placeholder="Ex: José da Silva" {...register("nomePai")} className="bg-muted" />
                    </div>
                    </div>
                </div>

                <div className="space-y-6 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold">Contato</h2>
                    <div className="flex flex-col space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="telefone-principal">Telefone Principal</Label>
                        <Input id="telefone-principal" type="tel" placeholder="(00) 00000-0000" {...register("telefonePrincipal")} onChange={applyMask(maskPhone)} maxLength={15} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="telefone-secundario">Telefone Secundário</Label>
                        <Input id="telefone-secundario" type="tel" placeholder="(00) 00000-0000" {...register("telefoneSecundario")} onChange={applyMask(maskPhone)} maxLength={15} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email-pessoal">E-mail Pessoal</Label>
                        <Input id="email-pessoal" type="email" placeholder="exemplo@email.com" {...register("emailPessoal")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contato-emergencia-nome">Contato de Emergência (Nome)</Label>
                        <Input id="contato-emergencia-nome" placeholder="Ex: Maria da Silva" {...register("contatoEmergenciaNome")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contato-emergencia-telefone">Contato de Emergência (Telefone)</Label>
                        <Input id="contato-emergencia-telefone" type="tel" placeholder="(00) 00000-0000" {...register("contatoEmergenciaTelefone")} onChange={applyMask(maskPhone)} maxLength={15} className="bg-muted" />
                    </div>
                    </div>
                </div>

                <div className="space-y-6 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold">Endereço</h2>
                    <div className="flex flex-col space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <Input id="cep" placeholder="00000-000" {...register("cep")} onChange={applyMask(maskCEP)} maxLength={9} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="logradouro">Logradouro</Label>
                        <Input id="logradouro" placeholder="Ex: Rua das Flores" {...register("logradouro")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="numero">Número</Label>
                        <Input id="numero" placeholder="Ex: 123" {...register("numero")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input id="complemento" placeholder="Ex: Apto 4B" {...register("complemento")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro</Label>
                        <Input id="bairro" placeholder="Ex: Centro" {...register("bairro")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input id="cidade" placeholder="Ex: Campo Grande" {...register("cidade")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="uf">UF</Label>
                        <Controller
                            name="uf"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="uf" className="bg-muted">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AC">AC</SelectItem>
                                    <SelectItem value="AL">AL</SelectItem>
                                    <SelectItem value="AP">AP</SelectItem>
                                    <SelectItem value="AM">AM</SelectItem>
                                    <SelectItem value="BA">BA</SelectItem>
                                    <SelectItem value="CE">CE</SelectItem>
                                    <SelectItem value="DF">DF</SelectItem>
                                    <SelectItem value="ES">ES</SelectItem>
                                    <SelectItem value="GO">GO</SelectItem>
                                    <SelectItem value="MA">MA</SelectItem>
                                    <SelectItem value="MT">MT</SelectItem>
                                    <SelectItem value="MS">MS</SelectItem>
                                    <SelectItem value="MG">MG</SelectItem>
                                    <SelectItem value="PA">PA</SelectItem>
                                    <SelectItem value="PB">PB</SelectItem>
                                    <SelectItem value="PR">PR</SelectItem>
                                    <SelectItem value="PE">PE</SelectItem>
                                    <SelectItem value="PI">PI</SelectItem>
                                    <SelectItem value="RJ">RJ</SelectItem>
                                    <SelectItem value="RN">RN</SelectItem>
                                    <SelectItem value="RS">RS</SelectItem>
                                    <SelectItem value="RO">RO</SelectItem>
                                    <SelectItem value="RR">RR</SelectItem>
                                    <SelectItem value="SC">SC</SelectItem>
                                    <SelectItem value="SP">SP</SelectItem>
                                    <SelectItem value="SE">SE</SelectItem>
                                    <SelectItem value="TO">TO</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    </div>
                </div>
                </div>
            </TabsContent>
            <TabsContent value="profissionais" className="mt-0">
                <div className="space-y-8">
                <div className="space-y-6 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold">Informações do Cargo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="tipo-vinculo">Tipo de Vínculo</Label>
                        <Controller
                            name="vinculo"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="tipo-vinculo" className="bg-muted">
                                    <SelectValue placeholder="Selecione o tipo de vínculo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Efetivo">Efetivo</SelectItem>
                                    <SelectItem value="Terceirizado">Terceirizado</SelectItem>
                                    <SelectItem value="Cedido">Cedido</SelectItem>
                                    <SelectItem value="Contratado">Contratado</SelectItem>
                                    <SelectItem value="Comissionado">Comissionado</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    {tipoVinculo === 'Efetivo' && (
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="matricula">Matrícula</Label>
                            <Input id="matricula" placeholder="Digite a matrícula" {...register("matricula")} className="bg-muted" />
                        </div>
                    )}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input id="cargo" placeholder="Ex: Desenvolvedor(a) Frontend" {...register("cargo")} className="bg-muted" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="funcao">Função</Label>
                        <Input id="funcao" placeholder="Ex: Coordenador de Curso" {...register("funcao")} className="bg-muted" />
                    </div>
                    <div className="space-y-2 w-[90%] md:w-full">
                        <Label htmlFor="data-inicio">Início de Exercício</Label>
                        <Input id="data-inicio" type="text" placeholder="dd/mm/aaaa" {...register("dataInicio")} onChange={applyMask(maskDate)} maxLength={10} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="possui-dga">Possui DGA?</Label>
                        <Controller
                            name="possuiDGA"
                            control={control}
                            defaultValue="nao"
                            render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="possui-dga" className="bg-muted">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sim">Sim</SelectItem>
                                    <SelectItem value="nao">Não</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    {watch('possuiDGA') === 'sim' && (
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="dga-descricao">Especificação DGA</Label>
                            <Textarea id="dga-descricao" placeholder="Descreva o DGA..." {...register("especificacaoDGA")} className="bg-muted" />
                        </div>
                    )}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="setor-lotacao">Setor / Lotação</Label>
                        <Input id="setor-lotacao" placeholder="Ex: Tecnologia da Informação" {...register("setor")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ramal">Ramal</Label>
                        <Input id="ramal" placeholder="Ex: 1234" {...register("ramal")} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="jornada">Jornada</Label>
                        <Controller
                            name="jornada"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="jornada" className="bg-muted">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="20h">20h</SelectItem>
                                    <SelectItem value="30h">30h</SelectItem>
                                    <SelectItem value="40h">40h</SelectItem>
                                    <SelectItem value="dedicacao-exclusiva">Dedicação Exclusiva</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="turno">Turno</Label>
                        <Controller
                            name="turno"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="turno" className="bg-muted">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="matutino">Matutino</SelectItem>
                                    <SelectItem value="vespertino">Vespertino</SelectItem>
                                    <SelectItem value="noturno">Noturno</SelectItem>
                                    <SelectItem value="integral">Integral</SelectItem>
                                    <SelectItem value="outro">Outro</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    {turno === 'outro' && (
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="outro-turno">Qual?</Label>
                            <Textarea id="outro-turno" placeholder="Descreva o turno..." {...register("outroTurno")} className="bg-muted" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Controller
                            name="status"
                            control={control}
                            defaultValue="Ativo"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="status" className="bg-muted">
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ativo">Ativo</SelectItem>
                                    <SelectItem value="Licença">Licença</SelectItem>
                                    <SelectItem value="Inativo">Inativo</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email-institucional">E-mail Institucional</Label>
                        <Input id="email-institucional" type="email" placeholder="nome@workwise.com" {...register("emailInstitucional")} className="bg-muted" />
                    </div>
                    </div>
                </div>
                </div>
            </TabsContent>
            <TabsContent value="formacao" className="mt-0">
                <div className="space-y-8">
                <div className="space-y-6 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold">Formação Acadêmica</h2>
                    <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="escolaridade">Escolaridade</Label>
                    <Controller
                        name="escolaridade"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="escolaridade" className="bg-muted">
                                    <SelectValue placeholder="Selecione o nível de..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nao-alfabetizado">Não Alfabetizado</SelectItem>
                                    <SelectItem value="ensino-fundamental">Ensino Fundamental</SelectItem>
                                    <SelectItem value="ensino-medio">Ensino Médio</SelectItem>
                                    <SelectItem value="graduacao">Graduação</SelectItem>
                                    <SelectItem value="pos-graduacao">Pós-Graduação</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    </div>
                </div>

                {(escolaridade === 'ensino-fundamental' || escolaridade === 'ensino-medio') && (
                    <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="text-base">
                        {escolaridade === 'ensino-fundamental' ? 'Ensino Fundamental' : 'Ensino Médio'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="instituicao-ensino">Instituição de Ensino</Label>
                        <Input id="instituicao-ensino" placeholder="Nome da escola" {...register("instituicaoEnsinoBasico")} className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="ano-conclusao-ensino">Ano de Conclusão</Label>
                        <Input id="ano-conclusao-ensino" placeholder="Ex: 2010" {...register("anoConclusaoEnsinoBasico")} className="bg-muted" />
                        </div>
                    </CardContent>
                    </Card>
                )}

                {(escolaridade === 'graduacao' || escolaridade === 'pos-graduacao') && (
                    <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="text-base">Graduação Base</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="curso-graduacao-base">Curso de Graduação</Label>
                        <Input id="curso-graduacao-base" placeholder="Ex: Análise de Sistemas" {...register("cursoGraduacao")} className="bg-muted" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="instituicao-graduacao">Instituição de Graduação</Label>
                        <Input id="instituicao-graduacao" placeholder="Nome da universidade" {...register("instituicaoGraduacao")} className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="ano-conclusao-graduacao">Ano de Conclusão da Graduação</Label>
                        <Input id="ano-conclusao-graduacao" placeholder="Ex: 2014" {...register("anoConclusaoGrad")} className="bg-muted" />
                        </div>
                    </CardContent>
                    </Card>
                )}
                
                {escolaridade === 'pos-graduacao' && (
                    <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="text-base">Pós-Graduação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="tipo-pos-graduacao">Tipo de Pós-Graduação</Label>
                        <Controller
                            name="tipoPosGraduacao"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="tipo-pos-graduacao" className="bg-muted">
                                        <SelectValue placeholder="Selecione o tipo..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="especializacao">Especialização</SelectItem>
                                    <SelectItem value="mba">MBA</SelectItem>
                                    <SelectItem value="mestrado">Mestrado</SelectItem>
                                    <SelectItem value="doutorado">Doutorado</SelectItem>
                                    <SelectItem value="pos-doutorado">Pós-Doutorado</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="curso-pos-graduacao">Curso de Pós-Graduação</Label>
                        <Input id="curso-pos-graduacao" placeholder="Nome do curso" {...register("cursoPosGraduacao")} className="bg-muted" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="instituicao-pos-graduacao">Instituição de Pós-Graduação</Label>                      <Input id="instituicao-pos-graduacao" placeholder="Nome da instituição" {...register("instituicaoPosGraduacao")} className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="ano-conclusao-pos-graduacao">Ano de Conclusão da Pós-Graduação</Label>
                        <Input id="ano-conclusao-pos-graduacao" placeholder="Ex: 2016" {...register("anoConclusaoPosGrad")} className="bg-muted" />
                        </div>
                    </CardContent>
                    </Card>
                )}

                </div>
            </TabsContent>
            <TabsContent value="observacoes" className="mt-0 flex flex-col flex-1">
                <div className="space-y-6 flex-1 p-4 rounded-lg">
                <h2 className="text-lg font-semibold">Observações Gerais</h2>
                <div className="space-y-2">
                    <Label htmlFor="observacoes-text">Observações</Label>
                    <Textarea id="observacoes-text" placeholder="Adicione qualquer observação relevante aqui..." rows={8} {...register("observacoes")} className="bg-muted" />
                </div>
                </div>
                <div className="mt-auto pt-4">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Enviando...' : 'Enviar Cadastro'}
                    </Button>
                </div>
            </TabsContent>
            </div>
        </Tabs>
        </form>
    </div>
  );
}

    