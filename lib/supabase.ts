import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

export interface Database {
  public: {
    Tables: {
      telegram_channels: {
        Row: {
          id: number
          token: string
          channel_name: string
          user_id: string
          created_at: string
        }
        Insert: {
          token: string
          channel_name: string
          user_id: string
        }
        Update: {
          token?: string
          channel_name?: string
        }
      }
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Клиент для админских операций
export const supabaseAdmin = createClient(
  supabaseUrl, 
  process.env.SUPABASE_SERVICE_KEY || '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

export interface TelegramChannel {
  id: number;
  token: string;
  channel_name: string;
  created_at: string;
  user_id: string;
}
