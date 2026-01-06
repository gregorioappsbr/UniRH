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

type Note = {
  title: string;
  content: string;
  updatedAt: string;
};

export default function NovaNotaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [originalTitle, setOriginalTitle] = useState<string | null>(null);

  useEffect(() => {
    const noteTitle = searchParams.get('title');
    const noteContent = searchParams.get('content');
    const initialOriginalTitle = searchParams.get('originalTitle');

    if (noteTitle) {
      setTitle(noteTitle);
      setIsEditing(true);
    }
    if (noteContent) {
      setContent(noteContent);
    }
    if (initialOriginalTitle) {
      setOriginalTitle(initialOriginalTitle);
    }
  }, [searchParams]);

  const handleSave = () => {
    const storedNotes = localStorage.getItem('notes');
    let notes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];
    const now = new Date();
    const updatedAt = `${now.toLocaleDateString()} às ${now.toLocaleTimeString()}`;

    if (isEditing && originalTitle) {
      // Find the note by its original title and update it
      const noteIndex = notes.findIndex(note => note.title === originalTitle);
      if (noteIndex !== -1) {
        notes[noteIndex] = { title, content, updatedAt };
      }
    } else {
      // Add a new note
      const newNote = { title, content, updatedAt };
      notes.push(newNote);
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    toast({
        title: "Nota salva!",
        description: "Sua nota foi salva com sucesso.",
    });

    if (!isEditing) {
        router.push('/notas');
    } else {
        // Update originalTitle in case the title itself was changed
        setOriginalTitle(title);
    }
  };

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
