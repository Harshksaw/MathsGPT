import { db } from "@/lib/dbClient";
import { Message } from "@/types";



export async function getConversationById(id: string, userIp: string) {
  return db
    .from('conversations')
    .select('*')
    .eq('id', id)
    .eq('user_ip', userIp)
    .single();
}

export async function updateConversationMessages(id: string, messages: Message[], status = 'ready') {
  return db
    .from('conversations')
    .update({
      messages,
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
}

export async function setStatus(id: string, status: 'ready'|'streaming'|'error') {
  return db.from('conversations').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
}


export async function saveMessages(id: string, messages: Message[]) {
  return db.from('conversations').update({
    messages,
    updated_at: new Date().toISOString(),
    status: 'ready'
  }).eq('id', id);
}



