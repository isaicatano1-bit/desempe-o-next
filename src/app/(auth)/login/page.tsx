import { Suspense } from 'react';

import { AuthForm } from '@/components/auth/AuthForm';

function AuthFormFallback() {
  return (
    <section className="w-full rounded-[20px] border border-[#DEDED5] bg-white p-5 shadow-[0_10px_24px_rgba(22,31,26,0.04)] sm:p-7">
      <div className="mb-6 h-8 w-24 animate-pulse rounded-full bg-[#EAF1E9]" />
      <div className="mb-4 h-8 w-48 animate-pulse rounded-full bg-[#F1F1EE]" />
      <div className="space-y-4">
        <div className="h-12 animate-pulse rounded-[12px] bg-[#F1F1EE]" />
        <div className="h-12 animate-pulse rounded-[12px] bg-[#F1F1EE]" />
        <div className="h-12 animate-pulse rounded-[12px] bg-[#F1F1EE]" />
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthFormFallback />}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
