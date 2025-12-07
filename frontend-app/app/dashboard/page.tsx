'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function DashboardPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    courses: 0,
    careers: 0,
    submissions: 0,
    certificates: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated]);

  async function loadStats() {
    try {
      const [coursesRes, careersRes, submissionsRes, certificatesRes] = await Promise.all([
        api.getCourses().catch(() => ({ data: [] })),
        api.getCareers().catch(() => ({ data: [] })),
        api.getSubmissions().catch(() => ({ data: [] })),
        api.getCertificates().catch(() => ({ data: [] })),
      ]);

      setStats({
        courses: coursesRes.data?.length || 0,
        careers: careersRes.data?.length || 0,
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

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido, {user?.full_name || 'Usuario'}
          </h1>
          <p className="mt-2 text-gray-600">
            {user?.role === 'alumno' && 'Estudiante'}
            {user?.role === 'profesor' && 'Profesor'}
            {user?.role === 'super_admin' && 'Administrador'}
            {!user?.role && 'Usuario'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📚</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Cursos Disponibles
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
                  href="/courses"
                  className="font-medium text-blue-600 hover:text-blue-900"
                >
                  Ver todos
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">🎓</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Carreras
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loadingStats ? '...' : stats.careers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href="/careers"
                  className="font-medium text-blue-600 hover:text-blue-900"
                >
                  Ver todas
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
                      Mis Entregas
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
                  href="/submissions"
                  className="font-medium text-blue-600 hover:text-blue-900"
                >
                  Ver todas
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
                  href="/certificates"
                  className="font-medium text-blue-600 hover:text-blue-900"
                >
                  Ver todos
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Accesos Rápidos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/courses"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Explorar Cursos</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver todos los cursos disponibles
              </p>
            </Link>
            <Link
              href="/careers"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Ver Carreras</h3>
              <p className="text-sm text-gray-600 mt-1">
                Explora las carreras completas
              </p>
            </Link>
            <Link
              href="/submissions"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Mis Entregas</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver y gestionar tus entregas
              </p>
            </Link>
            <Link
              href="/certificates"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Certificados</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver tus certificados obtenidos
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

