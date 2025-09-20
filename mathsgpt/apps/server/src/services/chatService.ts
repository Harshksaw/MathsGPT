import { ai } from "@/lib/openrouterai";
import { Message } from "@/types";

export async function completeOnce(messages: Message[], model?: string): Promise<string> {
  const res = await ai.chat.completions.create({
    // model: model || process.env.OPENROUTER_MODEL || 'openrouter/auto',
    model: "openai/chatgpt-4o-latest",
    messages,

  });


  const text = res.choices?.[0]?.message?.content ?? '';
  return text;
}