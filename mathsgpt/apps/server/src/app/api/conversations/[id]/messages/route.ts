import { NextResponse } from 'next/server';
import { getClientIp } from '@/utils/ip';
import { getConversationById, updateConversationMessages } from '@/services/conversationService';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const ip = getClientIp(req.headers);

  let body: { content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.content) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 });
  }

  const { data: convo, error } = await getConversationById(params.id, ip);
  if (error || !convo) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const messages = [...(convo.messages ?? []), { role: 'user', content: body.content }];

  await updateConversationMessages(convo.id, messages, 'ready');

  // For now, just echo back the message (later you’ll call OpenRouter)
  return NextResponse.json({ ok: true, messages });
}
