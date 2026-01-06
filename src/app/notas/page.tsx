'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { PlusCircle, Notebook, Share, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const initialNotes = [
  {
    title: 'Reunião de Alinhamento',
    updatedAt: '31/12/2022 às 20:00',
    content: 'Discutir as metas do próximo trimestre com a equipe de desenvolvimento.',
  },
  {
    title: 'Ideias para o Novo Projeto',
    updatedAt: '01/01/2023 às 20:00',
    content: 'Brainstorm de novas funcionalidades e possíveis tecnologias a serem utilizadas.',
  },
  {
    title: 'Lembretes Pessoais',
    updatedAt: '02/01/2023 às 20:00',
    content: 'Comprar café, agendar dentista e ligar para o cliente X.',
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useState(initialNotes);

  const handleDeleteNote = (indexToDelete: number) => {
    setNotes(notes.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="p-4 space-y-4">
      <header className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-3">
          <Notebook className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">BLOCO DE NOTAS</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Crie, edite e gerencie suas anotações
        </p>
      </header>

      <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white">
        <Link href="/notas/novo">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Nova Nota
        </Link>
      </Button>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {notes.map((note, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="bg-card border rounded-lg overflow-hidden">
            <AccordionTrigger className="p-4 hover:no-underline">
              <div className="flex flex-col items-start text-left">
                <span className="text-xs text-muted-foreground">Atualizado em {note.updatedAt}</span>
                <span className="text-lg font-semibold mt-1">{note.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
               <div className="space-y-4">
                <p>{note.content}</p>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon">
                    <Share className="h-5 w-5 text-green-500" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-5 w-5 text-blue-500" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Essa ação não pode ser desfeita. Isso excluirá permanentemente sua nota.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogAction onClick={() => handleDeleteNote(index)}>Confirmar</AlertDialogAction>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
