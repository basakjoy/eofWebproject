import LoginForm from '@/components/auth/LoginForm';
import Card from '@/components/common/Card';
import Link from 'next/link';
import { LogoIcon } from '@/components/common/LogoIcon';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-100  dark:via-blue-950/20 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <LogoIcon size={48} rounded />
            <span className="text-gray-900 dark:text-white text-2xl font-bold">Empire of Forex</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account to continue</p>
        </div>

        <Card>
          <LoginForm />
        </Card>

       
      </div>
    </div>
  );
}
