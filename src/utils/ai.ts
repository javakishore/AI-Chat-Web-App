import type { EngineOption } from '../types';

/**
 * Personality prompts for different AI engines
 * Each engine has a unique response style and focus
 */
const enginePrompts: Record<EngineOption, string> = {
  'Neural Nexus': 'balanced reasoning',
  'Cerebral Prime': 'deep thought and clarity',
  'Synapse Ultra': 'creative expression',
  'Logic Core': 'fast technical answers'
};

/**
 * Generate a mock AI response based on the selected engine
 * Used when OpenAI API is not available or configured
 * @param engine - The AI engine/personality to use
 * @param prompt - The user's input prompt
 * @returns A formatted response string
 */
export function getEngineReply(engine: EngineOption, prompt: string): string {
  const persona = enginePrompts[engine];
  // Clean up the prompt by trimming whitespace and normalizing spaces
  const cleanPrompt = prompt.trim().replace(/\s+/g, ' ');
  return `(${engine}) Based on ${persona}, here is a response to: "${cleanPrompt}"\n\n- I can help refine this idea and keep the chat flowing.`;
}

/**
 * Fetch a response from OpenAI's GPT-3.5-turbo API
 * Requires VITE_OPENAI_API_KEY environment variable to be set
 * @param prompt - The user's input prompt
 * @returns Promise resolving to the AI response or error message
 */
export async function fetchOpenAIResponse(prompt: string): Promise<string> {
  const token = import.meta.env.VITE_OPENAI_API_KEY;
  if (!token) {
    return Promise.resolve('Unable to reach OpenAI. Provide VITE_OPENAI_API_KEY to enable API responses.');
  }

  // Make API request to OpenAI
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8, // Controls creativity (0.0 = deterministic, 1.0 = very creative)
      max_tokens: 250 // Maximum response length
    })
  });

  if (!response.ok) {
    return `OpenAI request failed with status ${response.status}`;
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || 'OpenAI returned no content.';
}
