import { ScrollText } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-center py-4">
      <div className="flex items-center gap-3">
        <ScrollText className="h-24 w-24 text-primary" />
        <h1 className="text-5xl font-bold text-foreground">UniRH</h1>
      </div>
    </header>
  );
}
