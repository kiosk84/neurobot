import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { token, channelName } = await request.json();
    
    const { data, error } = await supabase
      .from('telegram_channels')
      .insert({
        token,
        channel_name: channelName,
        user_id: 'user1' // TODO: Заменить на реальный ID из сессии
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, channel: data[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('telegram_channels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, channels: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
