'use server';

/**
 * @fileOverview An AI agent that suggests optimal focus and rest durations based on the task and time of day.
 *
 * - smartSessionRecommendation - A function that handles the session recommendation process.
 * - SmartSessionRecommendationInput - The input type for the smartSessionRecommendation function.
 * - SmartSessionRecommendationOutput - The return type for the smartSessionRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SmartSessionRecommendationInputSchema = z.object({
  task: z
    .string()
    .describe('The task the user intends to work on during the focus session.'),
  timeOfDay: z
    .string()
    .describe(
      'The current time of day, formatted as a string, e.g., \'Morning\', \'Afternoon\', \'Evening\', or \'Night\'.'
    ),
});
export type SmartSessionRecommendationInput = z.infer<
  typeof SmartSessionRecommendationInputSchema
>;

const SmartSessionRecommendationOutputSchema = z.object({
  focusDuration: z
    .number()
    .describe('The recommended duration for the focus session, in minutes.'),
  shortRestDuration: z
    .number()
    .describe('The recommended duration for the short rest session, in minutes.'),
  longRestDuration: z
    .number()
    .describe('The recommended duration for the long rest session, in minutes.'),
});
export type SmartSessionRecommendationOutput = z.infer<
  typeof SmartSessionRecommendationOutputSchema
>;

export async function smartSessionRecommendation(
  input: SmartSessionRecommendationInput
): Promise<SmartSessionRecommendationOutput> {
  return smartSessionRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSessionRecommendationPrompt',
  input: {schema: SmartSessionRecommendationInputSchema},
  output: {schema: SmartSessionRecommendationOutputSchema},
  prompt: `You are an AI assistant designed to recommend optimal focus and rest durations for users of a time management app.

  Based on the task the user is working on and the time of day, suggest appropriate durations for focus, short rest, and long rest sessions.

  Consider these factors:
  - Task complexity: More complex tasks may benefit from longer focus sessions.
  - Time of day: Users may have different energy levels and preferences depending on the time of day.
  - General guidelines: Focus sessions are typically 25-50 minutes, short rests are 5-10 minutes, and long rests are 15-30 minutes.

  Task: {{{task}}}
  Time of Day: {{{timeOfDay}}}

  Please provide the recommended durations in minutes.
  Ensure that the output can be parsed as JSON.
`,
});

const smartSessionRecommendationFlow = ai.defineFlow(
  {
    name: 'smartSessionRecommendationFlow',
    inputSchema: SmartSessionRecommendationInputSchema,
    outputSchema: SmartSessionRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
