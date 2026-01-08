'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { X, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

type Note = {
  title: string;
  content: string;
  updatedAt: any;
};

export default function NovaNotaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();

  const noteId = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const noteRef = useMemoFirebase(() => {
    if (!firestore || !noteId) return null;
    return doc(firestore, 'notes', noteId);
  }, [firestore, noteId]);

  const { data: noteData, isLoading } = useDoc<Note>(noteRef);

  useEffect(() => {
    if (noteData) {
      setTitle(noteData.title);
      setContent(noteData.content);
      setIsEditing(true);
    } else if (noteId) {
      setIsEditing(true);
    }
  }, [noteData, noteId]);

  const handleSave = async () => {
    if (!firestore) return;

    const updatedAt = serverTimestamp();
    const notePayload = { title, content, updatedAt };

    try {
      if (isEditing && noteId) {
        // Update existing note
        const docRef = doc(firestore, 'notes', noteId);
        await setDoc(docRef, notePayload, { merge: true });
      } else {
        // Add a new note
        await addDoc(collection(firestore, 'notes'), notePayload);
      }

      toast({
          title: "Nota salva!",
          description: "Sua nota foi salva com sucesso.",
      });

      router.push('/notas');
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: "Não foi possível salvar a nota.",
      });
    }
  };

  if (isEditing && isLoading) {
    return <div className="p-4 text-center">Carregando nota...</div>
  }

  return (
    <div className="p-4 space-y-4 flex flex-col h-full">
      <header className="relative flex items-center justify-center mb-4">
        <h1 className="text-2xl font-bold">{isEditing ? 'Editar Nota' : 'Nova Nota'}</h1>
        <Button variant="ghost" size="icon" asChild className="absolute right-0 top-1/2 -translate-y-1/2">
          <Link href="/notas">
            <X className="h-5 w-5" />
          </Link>
        </Button>
      </header>

      <div className="space-y-6 flex-1 flex flex-col">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input 
            id="title" 
            placeholder="Título da sua nota" 
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        <div className="space-y-2 flex-1 flex flex-col">
          <Label htmlFor="content">Conteúdo</Label>
          <Textarea 
            id="content" 
            placeholder="Escreva sua nota aqui..." 
            className="flex-1" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Button className="w-full" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Nota
        </Button>
      </div>
    </div>
  );
}
