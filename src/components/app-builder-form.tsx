"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { suggestCoreFeatures } from "@/ai/flows/suggest-core-features";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  appName: z.string().min(2, {
    message: "O nome do aplicativo deve ter pelo menos 2 caracteres.",
  }),
  appDescription: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
});

export function AppBuilderForm() {
  const [suggestedFeatures, setSuggestedFeatures] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appName: "",
      appDescription: "",
    },
    mode: "onChange",
  });

  async function handleSuggestFeatures() {
    const isFormValid = await form.trigger();
    if (!isFormValid) {
        toast({
            title: "Formulário inválido",
            description: "Por favor, preencha o nome e a descrição do aplicativo.",
            variant: "destructive",
        });
        return;
    }
    const { appName, appDescription } = form.getValues();

    setIsSuggesting(true);
    setSuggestedFeatures([]);
    try {
      const result = await suggestCoreFeatures({ appName, appDescription });
      setSuggestedFeatures(result.suggestedFeatures);
    } catch (error) {
      console.error("Error suggesting features:", error);
      toast({
        title: "Erro ao sugerir recursos",
        description: "Ocorreu um problema ao se comunicar com a IA. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  }

  function onSave(values: z.infer<typeof formSchema>) {
    console.log("Saving app details:", { ...values, features: suggestedFeatures });
    toast({
        title: "Aplicativo Salvo!",
        description: "Os detalhes do seu aplicativo foram salvos com sucesso.",
    });
  }

  return (
    <Card className="w-full shadow-lg border-primary/10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)}>
          <CardHeader>
            <CardTitle>Detalhes do Aplicativo</CardTitle>
            <CardDescription>
              Comece nomeando e descrevendo seu aplicativo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="appName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Aplicativo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Mestre de Churrasco" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Aplicativo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Um aplicativo para ajudar os entusiastas do churrasco a encontrar receitas, dicas e organizar eventos."
                      className="resize-none h-28"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <div className="flex items-center">
                <Button
                    type="button"
                    onClick={handleSuggestFeatures}
                    disabled={isSuggesting}
                    variant="outline"
                    className="bg-background"
                >
                    {isSuggesting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Sugerir Recursos com IA
                </Button>
            </div>

            {(isSuggesting || suggestedFeatures.length > 0) && (
              <Separator className="my-6" />
            )}
            
            {isSuggesting && (
                <div className="space-y-2 text-center text-muted-foreground animate-pulse p-4">
                    <p>Gerando sugestões de recursos incríveis...</p>
                </div>
            )}

            {suggestedFeatures.length > 0 && !isSuggesting && (
                <div className="space-y-4 animate-in fade-in duration-500">
                    <h3 className="text-lg font-semibold tracking-tight">Recursos Sugeridos</h3>
                    <div className="flex flex-wrap gap-3">
                        {suggestedFeatures.map((feature, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="text-sm px-3 py-1 transition-transform hover:scale-105 cursor-default"
                                style={{ animation: `fadeIn 0.5s ease-out ${index * 100}ms backwards` }}
                            >
                                {feature}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg">Salvar Detalhes do Aplicativo</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
