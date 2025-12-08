'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function ProfessorDashboardPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    myCourses: 0,
    submissions: 0,
    students: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!loading && isAuthenticated && user?.role !== 'profesor') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, loading, router, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'profesor') {
      loadStats();
    }
  }, [isAuthenticated, user]);

  async function loadStats() {
    try {
      const [coursesRes, submissionsRes] = await Promise.all([
        api.getCourses().catch(() => ({ data: [] })),
        api.getSubmissions().catch(() => ({ data: [] })),
      ]);

      // Filtrar cursos del profesor
      const myCourses = coursesRes.data?.filter(
        (course: any) => course.professor?.id === user?.id
      ) || [];

      // Filtrar submissions de los cursos del profesor
      const mySubmissions = submissionsRes.data?.filter((submission: any) =>
        myCourses.some((course: any) => course.id === submission.course_id)
      ) || [];

      // Obtener estudiantes únicos
      const uniqueStudents = new Set(
        mySubmissions.map((s: any) => s.student?.id).filter(Boolean)
      );

      setStats({
        myCourses: myCourses.length,
        submissions: mySubmissions.length,
        students: uniqueStudents.size,
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

  if (!isAuthenticated || user?.role !== 'profesor') {
    return null;
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel del Profesor
          </h1>
          <p className="mt-2 text-gray-600">
            Bienvenido, {user?.full_name || 'Profesor'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📚</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Mis Cursos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loadingStats ? '...' : stats.myCourses}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href="/professor/courses"
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
                      Entregas Recibidas
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
                  href="/professor/submissions"
                  className="font-medium text-blue-600 hover:text-blue-900"
                >
                  Ver entregas
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">👥</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Estudiantes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loadingStats ? '...' : stats.students}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="text-gray-500">Estudiantes activos</span>
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
              href="/professor/courses"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Mis Cursos</h3>
              <p className="text-sm text-gray-600 mt-1">
                Crear y gestionar tus cursos
              </p>
            </Link>
            <Link
              href="/careers"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Ver Carreras</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver las carreras donde están tus cursos
              </p>
            </Link>
            <Link
              href="/professor/submissions"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Ver Entregas</h3>
              <p className="text-sm text-gray-600 mt-1">
                Revisar entregas de tus estudiantes
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

