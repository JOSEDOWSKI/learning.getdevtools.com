'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    submissions: 0,
    certificates: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!loading && isAuthenticated && user?.role !== 'super_admin') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, loading, router, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'super_admin') {
      loadStats();
    }
  }, [isAuthenticated, user]);

  async function loadStats() {
    try {
      const [usersRes, coursesRes, submissionsRes, certificatesRes] = await Promise.all([
        api.getUsers().catch(() => ({ data: [] })),
        api.getCourses().catch(() => ({ data: [] })),
        api.getSubmissions().catch(() => ({ data: [] })),
        api.getCertificates().catch(() => ({ data: [] })),
      ]);

      setStats({
        users: usersRes.data?.length || 0,
        courses: coursesRes.data?.length || 0,
        submissions: submissionsRes.data?.length || 0,
        certificates: certificatesRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoadingStats(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'super_admin') {
    return null;
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <p className="mt-2 text-gray-600">
            Bienvenido, {user?.full_name || 'Administrador'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">👥</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Usuarios
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loadingStats ? '...' : stats.users}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href="/admin/users"
                  className="font-medium text-blue-600 hover:text-blue-900"
                >
                  Gestionar usuarios
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📚</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Cursos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loadingStats ? '...' : stats.courses}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href="/admin/courses"
                  className="font-medium text-blue-600 hover:text-blue-900"
                >
                  Gestionar cursos
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📝</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Entregas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loadingStats ? '...' : stats.submissions}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href="/admin/submissions"
                  className="font-medium text-blue-600 hover:text-blue-900"
                >
                  Ver todas las entregas
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">🏆</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Certificados
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loadingStats ? '...' : stats.certificates}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href="/admin/certificates"
                  className="font-medium text-blue-600 hover:text-blue-900"
                >
                  Ver certificados
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/users"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Gestionar Usuarios</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver, editar y cambiar roles de usuarios
              </p>
            </Link>
            <Link
              href="/admin/courses"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Gestionar Cursos</h3>
              <p className="text-sm text-gray-600 mt-1">
                Crear, editar y eliminar cursos y carreras
              </p>
            </Link>
            <Link
              href="/admin/submissions"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Ver Entregas</h3>
              <p className="text-sm text-gray-600 mt-1">
                Revisar todas las entregas de estudiantes
              </p>
            </Link>
            <Link
              href="/admin/certificates"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Certificados</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver y gestionar todos los certificados
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

