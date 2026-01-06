'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Notebook, Share, Edit, Trash2, FileText, Copy } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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

type Note = {
  title: string;
  content: string;
  updatedAt: string;
};


export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    } else {
      setNotes(initialNotes);
      localStorage.setItem('notes', JSON.stringify(initialNotes));
    }
  }, []);

  const handleDeleteNote = (indexToDelete: number) => {
    const newNotes = notes.filter((_, index) => index !== indexToDelete);
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };
  
  const handleShare = async (note: Note) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: note.content,
        });
      } catch (error) {
        console.error('Erro ao compartilhar', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao compartilhar',
          description: 'Não foi possível compartilhar a nota.',
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Não suportado',
        description: 'Seu navegador não suporta a API de compartilhamento.',
      });
    }
  };

  const handleCopy = (note: Note) => {
    const textToCopy = `*${note.title}*\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: 'Copiado!',
        description: 'O conteúdo da nota foi copiado para a área de transferência.',
      });
    }).catch(err => {
      console.error('Erro ao copiar', err);
       toast({
          variant: 'destructive',
          title: 'Erro ao copiar',
          description: 'Não foi possível copiar a nota.',
        });
    });
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
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Share className="h-5 w-5 text-green-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleShare(note)}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Compartilhar como Texto</span>
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleCopy(note)}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Copiar Texto</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="ghost" size="icon" asChild>
                    <Link href={{ pathname: '/notas/novo', query: { title: note.title, content: note.content, originalTitle: note.title } }}>
                      <Edit className="h-5 w-5 text-blue-500" />
                    </Link>
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
