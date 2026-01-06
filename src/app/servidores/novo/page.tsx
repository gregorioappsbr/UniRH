'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"
import Link from "next/link"

export default function NewServerPage() {
  return (
    <div className="p-4 space-y-4 bg-background text-foreground">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Novo Servidor</h1>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/servidores">
            <X className="h-5 w-5" />
          </Link>
        </Button>
      </header>

      <Tabs defaultValue="pessoais" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="profissionais">Dados Profissionais</TabsTrigger>
          <TabsTrigger value="formacao">Formação</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
        </TabsList>
        <TabsContent value="pessoais" className="mt-6">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Identificação</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome-completo">Nome Completo</Label>
                  <Input id="nome-completo" placeholder="Ex: João da Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome-social">Nome Social</Label>
                  <Input id="nome-social" placeholder="Ex: Joanna" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" placeholder="000.000.000-00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input id="rg" placeholder="00.000.000-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgao-emissor">Órgão Emissor</Label>
                  <Input id="orgao-emissor" placeholder="Ex: SSP/MS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-nascimento">Data de Nascimento</Label>
                  <Input id="data-nascimento" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select>
                    <SelectTrigger id="sexo">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
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
                      <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                      <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  <Label htmlFor="naturalidade">Naturalidade</Label>
                  <Input id="naturalidade" placeholder="Ex: Campo Grande/MS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pcd">É PCD?</Label>
                   <Select>
                    <SelectTrigger id="pcd">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Filiação</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="nome-mae">Nome da Mãe</Label>
                  <Input id="nome-mae" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome-pai">Nome do Pai</Label>
                  <Input id="nome-pai" />
                </div>
              </div>
            </div>

             <div className="space-y-6">
              <h2 className="text-lg font-semibold">Contato</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone-principal">Telefone Principal</Label>
                  <Input id="telefone-principal" type="tel" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone-secundario">Telefone Secundário</Label>
                  <Input id="telefone-secundario" type="tel" placeholder="(00) 00000-0000" />
                </div>
                 <div className="space-y-2 col-span-2">
                  <Label htmlFor="email-pessoal">E-mail Pessoal</Label>
                  <Input id="email-pessoal" type="email" placeholder="exemplo@email.com" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Endereço</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" placeholder="00000-000" />
                </div>
                <div className="space-y-2 col-span-2">
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
                      <SelectItem value="MS">MS</SelectItem>
                      <SelectItem value="SP">SP</SelectItem>
                      <SelectItem value="RJ">RJ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Contato de Emergência</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contato-emergencia-nome">Nome</Label>
                  <Input id="contato-emergencia-nome" placeholder="Ex: Maria da Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contato-emergencia-telefone">Telefone</Label>
                  <Input id="contato-emergencia-telefone" type="tel" placeholder="(00) 00000-0000" />
                </div>
              </div>
            </div>

          </div>
        </TabsContent>
        <TabsContent value="profissionais" className="mt-6">
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
                      <SelectItem value="vinculo1">Vínculo 1</SelectItem>
                      <SelectItem value="vinculo2">Vínculo 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" placeholder="Ex: Desenvolvedor(a) Frontend" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="funcao">Função</Label>
                  <Input id="funcao" placeholder="Ex: Coordenador de Curso" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-inicio">Data de Início</Label>
                  <Input id="data-inicio" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="possui-dga">Possui DGA?</Label>
                  <Select>
                    <SelectTrigger id="possui-dga">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
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
        <TabsContent value="formacao">
          <p>Formação aqui.</p>
        </TabsContent>
        <TabsContent value="observacoes">
          <p>Observações aqui.</p>
        </TabsContent>
      </Tabs>

       <div className="flex justify-end pt-6">
        <Button>Salvar Servidor</Button>
      </div>
    </div>
  )
}
