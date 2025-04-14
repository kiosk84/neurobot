'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { auth, googleProvider } from '@/lib/firebase-config'
import { signInWithPopup } from 'firebase/auth'
import { FcGoogle } from 'react-icons/fc'

export default function LoginPage() {
  const router = useRouter()

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      router.push('/')
    } catch (error) {
      if (error.code !== 'auth/cancelled-popup-request') {
        console.error('Ошибка входа через Google:', error)
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Вход в систему
          </h2>
        </div>
        <Button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
          size="lg"
        >
          <FcGoogle className="w-5 h-5" />
          Войти через Google
        </Button>
      </div>
    </div>
  )
}
