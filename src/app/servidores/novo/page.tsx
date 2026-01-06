
'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { maskCPF, maskRG, maskCEP, maskPhone, maskDate } from "@/lib/masks"

export default function NewServerPage() {
    const [cpf, setCpf] = useState('');
    const [rg, setRg] = useState('');
    const [cep, setCep] = useState('');
    const [telefonePrincipal, setTelefonePrincipal] = useState('');
    const [telefoneSecundario, setTelefoneSecundario] = useState('');
    const [contatoEmergencia, setContatoEmergencia] = useState('');
    const [possuiCNH, setPossuiCNH] = useState('nao');
    const [genero, setGenero] = useState('');
    const [isPCD, setIsPCD] = useState('nao');
    const [dataNascimento, setDataNascimento] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [possuiDGA, setPossuiDGA] = useState('nao');

    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>, masker: (value: string) => string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setter(masker(event.target.value));
    };

  return (
    <div className="p-4">
      <Card className="bg-card text-card-foreground border-border">
        <CardContent className="p-4 space-y-4">
          <header className="relative flex items-center justify-center">
            <h1 className="text-3xl font-bold">Novo Servidor</h1>
            <Button variant="ghost" size="icon" asChild className="absolute right-0 top-1/2 -translate-y-1/2">
              <Link href="/servidores">
                <X className="h-5 w-5" />
              </Link>
            </Button>
          </header>

          <Tabs defaultValue="pessoais" className="w-full">
             <div className="border rounded-md">
                <TabsList className="h-auto items-center justify-center rounded-md p-1 flex flex-wrap w-full text-foreground bg-muted md:grid md:grid-cols-4">
                    <TabsTrigger value="pessoais" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Dados Pessoais</TabsTrigger>
                    <TabsTrigger value="profissionais" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Dados Profissionais</TabsTrigger>
                    <TabsTrigger value="formacao" className="data_-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Formação</TabsTrigger>
                    <TabsTrigger value="observacoes" className="data-[state=active]:text-primary-foreground w-1/2 md:w-auto flex-grow">Observações</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="pessoais" className="mt-8 md:mt-10">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Identificação</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="nome-completo">Nome Completo</Label>
                      <Input id="nome-completo" placeholder="Ex: João da Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nome-social">Nome Social</Label>
                      <Input id="nome-social" placeholder="Ex: João" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" placeholder="000.000.000-00" value={cpf} onChange={handleChange(setCpf, maskCPF)} maxLength={14} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rg">RG</Label>
                      <Input id="rg" placeholder="00.000.000-0" value={rg} onChange={handleChange(setRg, maskRG)} maxLength={12} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orgao-emissor">Órgão Emissor</Label>
                      <Input id="orgao-emissor" placeholder="Ex: SSP/MS" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="possui-cnh">Possui CNH?</Label>
                      <Select onValueChange={setPossuiCNH} defaultValue="nao">
                        <SelectTrigger id="possui-cnh">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sim">Sim</SelectItem>
                          <SelectItem value="nao">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {possuiCNH === 'sim' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cnh-numero">Número do Registro CNH</Label>
                          <Input id="cnh-numero" placeholder="00000000000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cnh-categoria">Categoria CNH</Label>
                          <Select>
                            <SelectTrigger id="cnh-categoria">
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
                        </div>
                      </>
                    )}
                    <div className="space-y-2 w-[90%] md:w-full">
                      <Label htmlFor="data-nascimento">Data de Nascimento</Label>
                      <Input id="data-nascimento" type="text" placeholder="dd/mm/aaaa" value={dataNascimento} onChange={handleChange(setDataNascimento, maskDate)} maxLength={10} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="genero">Gênero</Label>
                      <Select onValueChange={setGenero}>
                        <SelectTrigger id="genero">
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
                    </div>
                    {genero === 'outro' && (
                        <div className="space-y-2">
                            <Label htmlFor="outro-genero">Qual?</Label>
                            <Input id="outro-genero" placeholder="Descreva seu gênero" />
                        </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="raca-cor">Raça/Cor</Label>
                       <Select>
                        <SelectTrigger id="raca-cor">
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado-civil">Estado Civil</Label>
                       <Select>
                        <SelectTrigger id="estado-civil">
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
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="nacionalidade">Nacionalidade</Label>
                      <Input id="nacionalidade" placeholder="Ex: Brasileiro(a)" />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="naturalidade">Naturalidade</Label>
                      <Input id="naturalidade" placeholder="Ex: Campo Grande/MS" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pcd">É PCD?</Label>
                       <Select onValueChange={setIsPCD} defaultValue="nao">
                        <SelectTrigger id="pcd">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sim">Sim</SelectItem>
                          <SelectItem value="nao">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {isPCD === 'sim' && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="pcd-descricao">Descrição</Label>
                        <Textarea id="pcd-descricao" placeholder="Descreva a deficiência..." />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Filiação</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="nome-mae">Nome da Mãe</Label>
                      <Input id="nome-mae" placeholder="Ex: Maria da Silva" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="nome-pai">Nome do Pai</Label>
                      <Input id="nome-pai" placeholder="Ex: José da Silva" />
                    </div>
                  </div>
                </div>

                 <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Contato</h2>
                  <div className="flex flex-col space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone-principal">Telefone Principal</Label>
                      <Input id="telefone-principal" type="tel" placeholder="(00) 00000-0000" value={telefonePrincipal} onChange={handleChange(setTelefonePrincipal, maskPhone)} maxLength={15} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone-secundario">Telefone Secundário</Label>
                      <Input id="telefone-secundario" type="tel" placeholder="(00) 00000-0000" value={telefoneSecundario} onChange={handleChange(setTelefoneSecundario, maskPhone)} maxLength={15} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="email-pessoal">E-mail Pessoal</Label>
                      <Input id="email-pessoal" type="email" placeholder="exemplo@email.com" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Endereço</h2>
                  <div className="flex flex-col space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" placeholder="00000-000" value={cep} onChange={handleChange(setCep, maskCEP)} maxLength={9} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logradouro">Logradouro</Label>
                      <Input id="logradouro" placeholder="Ex: Rua das Flores" />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="numero">Número</Label>
                      <Input id="numero" placeholder="Ex: 123" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input id="complemento" placeholder="Ex: Apto 4B" />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input id="bairro" placeholder="Ex: Centro" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input id="cidade" placeholder="Ex: Campo Grande"/>
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="uf">UF</Label>
                      <Select>
                        <SelectTrigger id="uf">
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
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Contato de Emergência</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="contato-emergencia-nome">Nome</Label>
                      <Input id="contato-emergencia-nome" placeholder="Ex: Maria da Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contato-emergencia-telefone">Telefone</Label>
                      <Input id="contato-emergencia-telefone" type="tel" placeholder="(00) 00000-0000" value={contatoEmergencia} onChange={handleChange(setContatoEmergencia, maskPhone)} maxLength={15} />
                    </div>
                  </div>
                </div>

              </div>
            </TabsContent>
            <TabsContent value="profissionais" className="mt-8 md:mt-10">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Informações do Cargo</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="tipo-vinculo">Tipo de Vínculo</Label>
                      <Select>
                        <SelectTrigger id="tipo-vinculo">
                          <SelectValue placeholder="Selecione o tipo de vínculo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="efetivo">Efetivo</SelectItem>
                          <SelectItem value="terceirizado">Terceirizado</SelectItem>
                          <SelectItem value="cedido">Cedido</SelectItem>
                          <SelectItem value="contratado">Contratado</SelectItem>
                          <SelectItem value="comissionado">Comissionado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="cargo">Cargo</Label>
                      <Input id="cargo" placeholder="Ex: Desenvolvedor(a) Frontend" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="funcao">Função</Label>
                      <Input id="funcao" placeholder="Ex: Coordenador de Curso" />
                    </div>
                    <div className="space-y-2 w-[90%] md:w-full">
                      <Label htmlFor="data-inicio">Data de Início</Label>
                      <Input id="data-inicio" type="text" placeholder="dd/mm/aaaa" value={dataInicio} onChange={handleChange(setDataInicio, maskDate)} maxLength={10} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="possui-dga">Possui DGA?</Label>
                      <Select onValueChange={setPossuiDGA} defaultValue="nao">
                        <SelectTrigger id="possui-dga">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sim">Sim</SelectItem>
                          <SelectItem value="nao">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {possuiDGA === 'sim' && (
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="dga-descricao">Descrição</Label>
                            <Textarea id="dga-descricao" placeholder="Descreva o DGA..."/>
                        </div>
                    )}
                     <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="setor-lotacao">Setor / Lotação</Label>
                      <Input id="setor-lotacao" placeholder="Ex: Tecnologia da Informação" />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="ramal">Ramal</Label>
                      <Input id="ramal" placeholder="Ex: 1234" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jornada">Jornada</Label>
                      <Select>
                        <SelectTrigger id="jornada">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="integral">Integral</SelectItem>
                          <SelectItem value="parcial">Parcial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="turno">Turno</Label>
                      <Select>
                        <SelectTrigger id="turno">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="matutino">Matutino</SelectItem>
                          <SelectItem value="vespertino">Vespertino</SelectItem>
                           <SelectItem value="noturno">Noturno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                           <SelectItem value="licenca">Licença</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email-institucional">E-mail Institucional</Label>
                      <Input id="email-institucional" type="email" placeholder="nome@workwise.com" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="formacao" className="mt-8 md:mt-10">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Formação Acadêmica</h2>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="escolaridade">Escolaridade</Label>
                    <Select>
                      <SelectTrigger id="escolaridade">
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
                  </div>
                </div>

                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Graduação Base</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="curso-graduacao-base">Curso de Graduação</Label>
                      <Input id="curso-graduacao-base" placeholder="Ex: Análise de Sistemas" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="instituicao-graduacao">Instituição de Graduação</Label>
                      <Input id="instituicao-graduacao" placeholder="Nome da universidade" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ano-conclusao-graduacao">Ano de Conclusão da Graduação</Label>
                      <Input id="ano-conclusao-graduacao" placeholder="Ex: 2014" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Pós-Graduação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="tipo-pos-graduacao">Tipo de Pós-Graduação</Label>
                      <Select>
                        <SelectTrigger id="tipo-pos-graduacao">
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
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="curso-pos-graduacao">Curso de Pós-Graduação</Label>
                      <Input id="curso-pos-graduacao" placeholder="Nome do curso" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="instituicao-pos-graduacao">Instituição de Pós-Graduação</Label>                      <Input id="instituicao-pos-graduacao" placeholder="Nome da instituição" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ano-conclusao-pos-graduacao">Ano de Conclusão da Pós-Graduação</Label>
                      <Input id="ano-conclusao-pos-graduacao" placeholder="Ex: 2016" />
                    </div>
                  </CardContent>
                </Card>

              </div>
            </TabsContent>
            <TabsContent value="observacoes" className="mt-8 md:mt-10">
               <div className="space-y-6">
                <h2 className="text-lg font-semibold">Observações Gerais</h2>
                <div className="space-y-2">
                    <Label htmlFor="observacoes-text">Observações</Label>
                    <Textarea id="observacoes-text" placeholder="Adicione qualquer observação relevante aqui..." rows={8} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

    