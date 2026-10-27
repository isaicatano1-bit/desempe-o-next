'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const loginSchema = z.object({
  email: z.email('Introduce un email válido.'),
  password: z.string().min(1, 'La contraseña es obligatoria.'),
});

const registerSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z.email('Introduce un email válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

type AuthFormMode = 'login' | 'register';

type FormErrors = Partial<Record<string, string>> & { api?: string };

export function AuthForm({ mode }: { mode: AuthFormMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/explorar';
  const isRegister = mode === 'register';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const title = useMemo(
    () => (isRegister ? 'Crear tu cuenta' : 'Inicia sesión'),
    [isRegister],
  );

  const subtitle = useMemo(
    () =>
      isRegister
        ? 'Reserva espacios en minutos y gestiona tus reuniones con total claridad.'
        : 'Accede a tus reservas, favoritos y horarios guardados.',
    [isRegister],
  );

  const onInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, api: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    const validation = isRegister ? registerSchema.safeParse(formData) : loginSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        ...Object.fromEntries(
          Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0] ?? '']),
        ),
      });
      setLoading(false);
      return;
    }

    const endpoint = isRegister ? '/api/v1/auth/register' : '/api/v1/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
        credentials: 'same-origin',
      });

      const data = (await response.json().catch(() => ({}))) as {
        errors?: Record<string, string | string[]>;
        message?: string;
        role?: 'USER' | 'ADMIN';
        user?: { role?: 'USER' | 'ADMIN' };
      };

      if (!response.ok) {
        const fieldErrors = data.errors ?? {};
        const apiError = data.message ?? 'No se pudo completar la operación.';
        setErrors({
          ...(typeof fieldErrors === 'object' ? fieldErrors : {}),
          api: apiError,
        });
        setLoading(false);
        return;
      }

      const role = data.role ?? data.user?.role ?? 'USER';
      const targetPath = role === 'ADMIN' ? '/admin' : next && !next.startsWith('/admin') ? next : '/explorar';

      router.replace(targetPath);
      router.refresh();
    } catch (error) {
      setErrors({ api: 'Ha ocurrido un error inesperado. Inténtalo de nuevo.' });
      setLoading(false);
    }
  };

  return (
    <section className="w-full rounded-[20px] border border-[#DEDED5] bg-white p-5 shadow-[0_10px_24px_rgba(22,31,26,0.04)] sm:p-7">
      <div className="mb-6 flex items-center justify-center gap-2 text-[#245642]">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1E9]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.14em]">CoSpace</span>
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-[2.1rem] font-semibold tracking-[-0.06em] text-[#222D28]">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-[#727970]">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister ? (
          <Input
            label="Nombre"
            name="name"
            type="text"
            placeholder="Lucía Gómez"
            value={formData.name}
            onChange={(event) => onInputChange('name', event.target.value)}
            error={errors.name}
            autoComplete="name"
          />
        ) : null}

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(event) => onInputChange('email', event.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <div className="relative">
          <Input
            label="Contraseña"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={isRegister ? 'Mínimo 8 caracteres' : '••••••••'}
            value={formData.password}
            onChange={(event) => onInputChange('password', event.target.value)}
            error={errors.password}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            className="pr-12"
          />

          <button
            type="button"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => setShowPassword((current) => !current)}
            className="absolute bottom-[18px] right-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#727970] transition hover:bg-[#F7F6F2] hover:text-[#245642]"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {errors.api ? (
          <div className="rounded-[12px] border border-[#F1D4D1] bg-[#F6E4E1] px-3 py-2 text-sm text-[#A33B32]">
            {errors.api}
          </div>
        ) : null}

        <Button type="submit" className="mt-2 w-full" loading={loading} icon={<ArrowRight className="h-4 w-4" />}>
          {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[#727970]">
        {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
        <Link href={isRegister ? '/login' : '/registro'} className="font-semibold text-[#245642] hover:text-[#1d473a]">
          {isRegister ? 'Iniciar sesión' : 'Crear cuenta'}
        </Link>
      </div>
    </section>
  );
}
