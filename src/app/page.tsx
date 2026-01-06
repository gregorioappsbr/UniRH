import { AppBuilderForm } from "@/components/app-builder-form";
import { Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full bg-background font-body">
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-2xl mx-auto">
                <header className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                        <Cpu className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                        Criador de Aplicativos
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Defina seu aplicativo, obtenha sugestões de recursos com IA e dê vida à sua ideia.
                    </p>
                </header>

                <AppBuilderForm />

                <footer className="text-center mt-10 text-sm text-muted-foreground">
                    <p>Powered by Firebase Studio</p>
                </footer>
            </div>
        </main>
    </div>
  );
}
