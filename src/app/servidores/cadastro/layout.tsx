
// This is a special layout for the public registration form.
// It ensures that unauthenticated users only see the form and nothing else.
export default function CadastroServidorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
