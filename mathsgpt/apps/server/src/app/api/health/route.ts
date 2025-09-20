import { NextResponse } from 'next/server';
import { getClientIp } from '@/utils/ip';
import {supabaseAdmin} from '@/lib/dbClient'

export async function GET(req: Request) {

  const ip = getClientIp(req.headers);

  // console.log('🚀 ~ :8 ~ GET ~ ip::==', ip)

  const envOk = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { error } = await supabaseAdmin.from('conversations').select('id').limit(1);
  const ok = envOk && !error;

  return NextResponse.json({
    success: ok,
    ts: new Date().toISOString(),
    env: process.env.NODE_ENV,
    i:ip
  });
}
