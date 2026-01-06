'use server';

/**
 * @fileOverview Provides AI-powered suggestions for core features of an application based on its name and description.
 *
 * - suggestCoreFeatures - A function that takes an app name and description and returns suggested core features.
 * - SuggestCoreFeaturesInput - The input type for the suggestCoreFeatures function.
 * - SuggestCoreFeaturesOutput - The return type for the suggestCoreFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCoreFeaturesInputSchema = z.object({
  appName: z.string().describe('The name of the application.'),
  appDescription: z.string().describe('The description of the application.'),
});
export type SuggestCoreFeaturesInput = z.infer<typeof SuggestCoreFeaturesInputSchema>;

const SuggestCoreFeaturesOutputSchema = z.object({
  suggestedFeatures: z
    .array(z.string())
    .describe('An array of suggested core features for the application.'),
});
export type SuggestCoreFeaturesOutput = z.infer<typeof SuggestCoreFeaturesOutputSchema>;

export async function suggestCoreFeatures(input: SuggestCoreFeaturesInput): Promise<SuggestCoreFeaturesOutput> {
  return suggestCoreFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCoreFeaturesPrompt',
  input: {schema: SuggestCoreFeaturesInputSchema},
  output: {schema: SuggestCoreFeaturesOutputSchema},
  prompt: `You are an AI assistant helping app developers to brainstorm core features for their applications.

  Based on the application name and description provided, suggest a list of core features that would be relevant and useful for the application.

  Application Name: {{{appName}}}
  Application Description: {{{appDescription}}}

  Please provide the suggested features as a list of strings.
  `,
});

const suggestCoreFeaturesFlow = ai.defineFlow(
  {
    name: 'suggestCoreFeaturesFlow',
    inputSchema: SuggestCoreFeaturesInputSchema,
    outputSchema: SuggestCoreFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
