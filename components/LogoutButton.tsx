"use client";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      className="text-red-600 hover:text-red-800"
    >
      Выйти
    </Button>
  );
}
