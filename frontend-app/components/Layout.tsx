'use client';

import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Navegación según el rol
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
    if (user?.role === 'super_admin') {
      return '/admin/dashboard';
    } else if (user?.role === 'profesor') {
      return '/professor/dashboard';
    }
    return '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href={getHomeLink()} className="text-xl font-bold text-blue-600">
                  🇵🇪 Plataforma Educativa
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === item.href
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.full_name}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

