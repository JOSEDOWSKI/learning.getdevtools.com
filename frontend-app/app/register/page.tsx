'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'profesor' ? 'profesor' : 'alumno';
  const [formData, setFormData] = useState({
    dni: '',
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: initialRole,
    invite_code: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const role = user?.role;
      if (role === 'super_admin') {
        router.push('/admin/dashboard');
      } else if (role === 'profesor') {
        router.push('/professor/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, authLoading, router, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: 'var(--text-primary)' }}></div>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    if (formData.dni.length !== 8 || !/^\d{8}$/.test(formData.dni)) {
      setError('El DNI debe tener 8 digitos');
      return;
    }

    setLoading(true);

    try {
      const success = await register({
        dni: formData.dni,
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        invite_code: formData.role === 'profesor' ? formData.invite_code || undefined : undefined,
      });

      if (success) {
        await new Promise(resolve => setTimeout(resolve, 200));
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Error al registrar. Verifica tus datos.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Error al registrar. Intenta de nuevo.');
      setLoading(false);
    }
  }

  const inputStyle = { border: '1px solid var(--warm-border)', background: '#ffffff', color: 'var(--text-primary)' };

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="nav-gold-bar" />

      <nav style={{ background: '#ffffff', borderBottom: '1px solid var(--warm-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link
              href="/"
              className="text-lg tracking-tight"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, color: 'var(--text-primary)' }}
            >
              DEVTOOLS
            </Link>
            <Link href="/courses" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Cursos
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 pt-12 pb-16">
        <div className="flex items-center justify-center space-x-6 mb-10">
          <Link
            href="/login"
            className="text-lg pb-2"
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontWeight: 400,
              color: 'var(--text-muted)',
              borderBottom: '2px solid transparent',
            }}
          >
            Iniciar Sesion
          </Link>
          <span
            className="text-lg pb-2"
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontWeight: 600,
              color: 'var(--text-primary)',
              borderBottom: '2px solid var(--text-primary)',
            }}
          >
            Registrarse
          </span>
        </div>

        <p className="text-sm mb-8 text-center" style={{ color: 'var(--text-secondary)' }}>
          {formData.role === 'profesor'
            ? 'Registrate como profesor en DevTools Learning.'
            : 'Crea tu cuenta de alumno en DevTools Learning.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 rounded text-sm" style={{ background: 'var(--error-bg)', color: 'var(--error)', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>DNI (8 digitos)</label>
            <input
              type="text"
              value={formData.dni}
              onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
              required
              maxLength={8}
              pattern="[0-9]{8}"
              className="w-full px-4 py-3 text-sm rounded"
              style={inputStyle}
              placeholder="12345678"
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Nombre Completo</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              className="w-full px-4 py-3 text-sm rounded"
              style={inputStyle}
              placeholder="Juan Perez"
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 text-sm rounded"
              style={inputStyle}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Rol</label>
            <input
              type="text"
              value={formData.role === 'profesor' ? 'Profesor' : 'Alumno'}
              readOnly
              className="w-full px-4 py-3 text-sm rounded"
              style={{ ...inputStyle, background: 'var(--cream-light)', color: 'var(--text-secondary)' }}
            />
          </div>

          {formData.role === 'profesor' && (
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Codigo de invitacion</label>
              <input
                type="text"
                value={formData.invite_code}
                onChange={(e) => setFormData({ ...formData, invite_code: e.target.value })}
                required
                className="w-full px-4 py-3 text-sm rounded"
                style={inputStyle}
                placeholder="Codigo de invitacion"
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Contrasena</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              className="w-full px-4 py-3 text-sm rounded"
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Confirmar Contrasena</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="w-full px-4 py-3 text-sm rounded"
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--btn-primary)', color: '#ffffff' }}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-8 pt-8 text-center" style={{ borderTop: '1px solid var(--warm-border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Ya tienes cuenta?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>
              Inicia sesion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: 'var(--text-primary)' }}></div>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>Cargando...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
