import { db } from "@/lib/dbClient";


export async function logUser(conversationId: string, userIp: string, prompt: string) {
  return db.from('transactions').insert([{ conversation_id: conversationId, user_ip: userIp, direction: 'user', prompt }]);
}

export async function logAssistant(conversationId: string, userIp: string, completion: string, model?: string) {
  return db.from('transactions').insert([{
    conversation_id: conversationId,
    user_ip: userIp,
    direction: 'assistant',
    completion,
    model
  }]);
}
