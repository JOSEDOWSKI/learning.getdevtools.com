'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role;
      if (role === 'super_admin') {
        router.push('/admin/dashboard');
      } else if (role === 'profesor') {
        router.push('/professor/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      await new Promise(resolve => setTimeout(resolve, 300));
    } else {
      setError('Credenciales invalidas');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Gold top bar */}
      <div className="nav-gold-bar" />

      {/* Navigation */}
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
            <div className="flex items-center space-x-6">
              <Link href="/courses" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Cursos
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="max-w-md mx-auto px-4 pt-16">
        <div className="flex items-center justify-center space-x-6 mb-10">
          <span
            className="text-lg pb-2"
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontWeight: 600,
              color: 'var(--text-primary)',
              borderBottom: '2px solid var(--text-primary)',
            }}
          >
            Iniciar Sesion
          </span>
          <Link
            href="/register"
            className="text-lg pb-2"
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontWeight: 400,
              color: 'var(--text-muted)',
              borderBottom: '2px solid transparent',
            }}
          >
            Registrarse
          </Link>
        </div>

        <p className="text-sm mb-8 text-center" style={{ color: 'var(--text-secondary)' }}>
          Inicia sesion con tu cuenta de DevTools Learning.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              className="px-4 py-3 rounded text-sm"
              style={{ background: 'var(--error-bg)', color: 'var(--error)', border: '1px solid #fecaca' }}
            >
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm rounded"
              style={{ border: '1px solid var(--warm-border)', background: '#ffffff', color: 'var(--text-primary)' }}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Contrasena
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm rounded"
              style={{ border: '1px solid var(--warm-border)', background: '#ffffff', color: 'var(--text-primary)' }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--btn-primary)', color: '#ffffff' }}
          >
            {loading ? 'Iniciando sesion...' : 'Iniciar Sesion'}
          </button>
        </form>

        <div className="mt-8 pt-8 text-center" style={{ borderTop: '1px solid var(--warm-border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No tienes cuenta?{' '}
            <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>
              Registrate aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
