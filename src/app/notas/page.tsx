
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Notebook, Share, Edit, Trash2, FileText, Copy, FileDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { jsPDF } from "jspdf";
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';

type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: Timestamp | Date;
};

const noteColors = [
  'bg-lime-200/50 dark:bg-lime-500/20',
  'bg-cyan-200/50 dark:bg-cyan-500/20',
  'bg-fuchsia-200/50 dark:bg-fuchsia-500/20',
  'bg-emerald-200/50 dark:bg-emerald-500/20',
  'bg-rose-200/50 dark:bg-rose-500/20',
  'bg-amber-200/50 dark:bg-amber-500/20',
];


export default function NotesPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const notesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'notes');
  }, [firestore]);

  const { data: notes, isLoading } = useCollection<Note>(notesQuery);

  const handleDeleteNote = async (noteId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'notes', noteId));
      toast({
        title: "Nota excluída!",
        description: "A nota foi removida com sucesso.",
      });
    } catch (error) {
       console.error('Erro ao excluir nota:', error);
       toast({
          variant: 'destructive',
          title: 'Erro ao excluir',
          description: 'Não foi possível excluir a nota.',
        });
    }
  };
  
  const handleShare = async (note: Note) => {
    const textToShare = `${note.title}\n\n${note.content}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: textToShare,
        });
      } catch (error) {
         if (error instanceof DOMException && (error.name === 'AbortError' || error.name === 'NotAllowedError')) {
          // User cancelled the share sheet or permission was denied, do nothing.
        } else {
          console.error('Erro ao compartilhar', error);
          // Fallback for desktop or if share fails
          handleCopy(note);
          toast({
            variant: 'destructive',
            title: 'Compartilhamento não disponível',
            description: 'A função de compartilhar não está disponível neste navegador. O conteúdo da nota foi copiado para a área de transferência.',
          });
        }
      }
    } else {
      // Fallback for browsers that do not support navigator.share (e.g., most desktop browsers)
      handleCopy(note);
      toast({
        title: 'Link copiado!',
        description: 'Seu navegador não suporta o compartilhamento nativo. O conteúdo da nota foi copiado para a área de transferência.',
      });
    }
  };

  const handleCopy = (note: Note) => {
    const textToCopy = `${note.title}\n\n${note.content}`;
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

  const handleShareWhatsApp = (note: Note) => {
    const textToShare = `${note.title}\n\n${note.content}`;
    const encodedText = encodeURIComponent(textToShare);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleExportPDF = async (note: Note) => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      let y = 20;

      // --- Título ---
      doc.setFillColor(66, 153, 225); // Blue color
      doc.rect(15, y - 5, doc.internal.pageSize.width - 30, 8, 'F');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text("TÍTULO", 20, y);
      y += 12;

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      const splitTitle = doc.splitTextToSize(note.title, 180);
      doc.text(splitTitle, 15, y);
      y += (splitTitle.length * 7) + 10;
      
      // --- Assunto ---
      doc.setFillColor(66, 153, 225); // Blue color
      doc.rect(15, y - 5, doc.internal.pageSize.width - 30, 8, 'F');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text("ASSUNTO", 20, y);
      y += 12;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      const splitContent = doc.splitTextToSize(note.content, 180);
      doc.text(splitContent, 15, y);
      
      doc.save(`${note.title.replace(/\s/g, '_')}.pdf`);
    } catch(error) {
       console.error('Erro ao exportar PDF', error);
       toast({
          variant: 'destructive',
          title: 'Erro ao exportar',
          description: 'Não foi possível exportar a nota como PDF.',
        });
    }
  };

  const formatDate = (timestamp: Timestamp | Date): string => {
    if (!timestamp) return 'Data inválida';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    if (isNaN(date.getTime())) return 'Data inválida';
    return date.toLocaleString('pt-BR');
  }


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

      {isLoading && <p className="text-center">Carregando notas...</p>}

      {!isLoading && notes && notes.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {notes.sort((a, b) => (b.updatedAt as Date).getTime() - (a.updatedAt as Date).getTime()).map((note, index) => (
            <AccordionItem key={note.id} value={`item-${note.id}`} className={cn("border rounded-lg overflow-hidden", noteColors[index % noteColors.length])}>
              <AccordionTrigger className="p-4 hover:no-underline">
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs text-muted-foreground">Atualizado em {formatDate(note.updatedAt)}</span>
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
                         <DropdownMenuItem onClick={() => handleShareWhatsApp(note)}>
                          <WhatsAppIcon className="mr-2 h-4 w-4" />
                          <span>Compartilhar no WhatsApp</span>
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleCopy(note)}>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Copiar Texto</span>
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleExportPDF(note)}>
                          <FileDown className="mr-2 h-4 w-4" />
                          <span>Exportar como PDF</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/notas/novo?id=${note.id}`}>
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
                        <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>Confirmar</AlertDialogAction>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        !isLoading && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted-foreground/50 rounded-lg mt-4">
            <p className="text-muted-foreground">Nenhuma nota encontrada.</p>
            <p className="text-muted-foreground text-sm mt-1">Clique em "Adicionar Nova Nota" para começar a escrever.</p>
          </div>
        )
      )}
    </div>
  );
}


    





    
