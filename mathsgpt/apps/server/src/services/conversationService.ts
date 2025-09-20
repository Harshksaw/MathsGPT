import { db } from "@/lib/dbClient";


export async function getConversationById(id: string, userIp: string) {
  return db
    .from('conversations')
    .select('*')
    .eq('id', id)
    .eq('user_ip', userIp)
    .single();
}

export async function updateConversationMessages(id: string, messages: any[], status = 'ready') {
  return db
    .from('conversations')
    .update({
      messages,
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
}
