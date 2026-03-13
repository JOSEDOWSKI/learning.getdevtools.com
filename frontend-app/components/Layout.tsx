'use client';

import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getNavItems = () => {
    if (user?.role === 'super_admin') {
      return [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/users', label: 'Usuarios' },
        { href: '/admin/careers', label: 'Carreras' },
        { href: '/admin/courses', label: 'Cursos' },
        { href: '/admin/submissions', label: 'Entregas' },
        { href: '/admin/certificates', label: 'Certificados' },
      ];
    } else if (user?.role === 'profesor') {
      return [
        { href: '/professor/dashboard', label: 'Dashboard' },
        { href: '/professor/courses', label: 'Mis Cursos' },
        { href: '/careers', label: 'Carreras' },
        { href: '/professor/submissions', label: 'Entregas' },
      ];
    } else {
      return [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/courses', label: 'Cursos' },
        { href: '/careers', label: 'Carreras' },
        { href: '/submissions', label: 'Mis Entregas' },
        { href: '/certificates', label: 'Certificados' },
      ];
    }
  };

  const navItems = getNavItems();

  const getHomeLink = () => {
    if (user?.role === 'super_admin') return '/admin/dashboard';
    if (user?.role === 'profesor') return '/professor/dashboard';
    return '/dashboard';
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Gold top bar like Anthropic Academy */}
      <div className="nav-gold-bar" />

      <nav style={{ background: '#ffffff', borderBottom: '1px solid var(--warm-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href={getHomeLink()}
                className="text-lg tracking-tight"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, color: 'var(--text-primary)' }}
              >
                DEVTOOLS
              </Link>
              <div className="hidden sm:flex sm:ml-10 sm:space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2 text-sm"
                    style={{
                      color: pathname === item.href ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: pathname === item.href ? 500 : 400,
                      borderBottom: pathname === item.href ? '2px solid var(--text-primary)' : '2px solid transparent',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {user?.full_name}
              </span>
              <button
                onClick={logout}
                className="text-sm px-4 py-2 rounded"
                style={{
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--warm-border)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--cream)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                Cerrar Sesion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
