import { NextResponse } from 'next/server';

import { getClientIp } from '@/utils/ip';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/dbClient';

const CreateSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  system: z.string().trim().min(1).max(2000).optional(), 
});

export async function GET(req: Request) {
  const ip = getClientIp(req.headers);

  const { data, error } = await supabaseAdmin
    .from('conversations')
    .select('id,title,status,created_at,updated_at')
    .eq('user_ip', ip)
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ conversations: data ?? [] });
}

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);

  let title = 'New Chat';
  let messages: Array<{ role: 'system'|'user'|'assistant'; content: string }> = [];
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = CreateSchema.parse(body);
    if (parsed.title) title = parsed.title;
    if (parsed.system) messages = [{ role: 'system', content: parsed.system }];
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('conversations')
    .insert([{ user_ip: ip, title, messages, status: 'ready' }])
    .select('id,title,status,created_at,updated_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ conversation: data }, { status: 201 });
}
