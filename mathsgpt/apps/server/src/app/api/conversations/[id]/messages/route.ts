import { NextResponse } from 'next/server';
import { getClientIp } from '@/utils/ip';
import { getConversationById, setStatus, saveMessages } from '@/services/conversationService';

import { logUser, logAssistant } from '@/services/transactionService';
import { completeOnce } from '@/services/chatService';

type Message = { role: 'system'|'user'|'assistant'; content: string };

export async function POST(req: Request, { params }: { params: { id: string } }) {


  const ip = getClientIp(req.headers);
  const{id } = await params;

  console.log('🚀 ~ :16 ~ POST ~ id::==', id)

  


  let body: { content?: string; model?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!body?.content) return NextResponse.json({ error: 'content is required' }, { status: 400 });


  const { data: convo, error } = await getConversationById(id, ip);
  if (error || !convo) return NextResponse.json({ error: `Conversation not found ${error}` }, { status: 404 });


  const messages: Message[] = [...(convo.messages ?? []), { role: 'user', content: body.content }];
  await setStatus(convo.id, 'streaming');
  await logUser(convo.id, ip, body.content);

  try {

    const assistantText = await completeOnce(messages, body.model);

    console.log('🚀 ~ :34 ~ POST ~ assistantText::==', assistantText)



    const updated: Message[] = [...messages, { role: 'assistant', content: assistantText }];
    await saveMessages(convo.id, updated);
    await logAssistant(convo.id, ip, assistantText, body.model);


    return NextResponse.json({ reply: assistantText, messages: updated }, { status: 200 });
  } catch (e: any) {
    await setStatus(convo.id, 'error');
    return NextResponse.json({ error: e.message || 'AI call failed' }, { status: 500 });
  }
}
