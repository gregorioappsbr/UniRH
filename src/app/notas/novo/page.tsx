'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NovaNotaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    const noteTitle = searchParams.get('title');
    const noteContent = searchParams.get('content');
    if (noteTitle) {
      setTitle(noteTitle);
      setIsEditing(true);
    }
    if (noteContent) {
      setContent(noteContent);
    }
  }, [searchParams]);

  const handleSave = () => {
    // Lógica para salvar a nota
    // Por enquanto, vamos apenas navegar de volta para a página de notas
    router.push('/notas');
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
