'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Identificação</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome-completo">Nome Completo</Label>
                <Input id="nome-completo" placeholder="Ex: João da Silva" />
              </div>
              <div>
                <Label htmlFor="nome-social">Nome Social</Label>
                <Input id="nome-social" placeholder="Ex: Joanna" />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" />
              </div>
              <div>
                <Label htmlFor="rg">RG</Label>
                <Input id="rg" placeholder="00.000.000-0" />
              </div>
              <div>
                <Label htmlFor="orgao-emissor">Órgão Emissor</Label>
                <Input id="orgao-emissor" placeholder="Ex: SSP/MS" />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="profissionais">
          <p>Dados profissionais aqui.</p>
        </TabsContent>
        <TabsContent value="formacao">
          <p>Formação aqui.</p>
        </TabsContent>
        <TabsContent value="observacoes">
          <p>Observações aqui.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
