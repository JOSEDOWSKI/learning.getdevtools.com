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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: 'var(--text-primary)' }}
          ></div>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Cargando...</p>
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
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--text-primary)' }}
          >
            Panel del Profesor
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Bienvenido, {user?.full_name || 'Profesor'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div
            className="card-warm overflow-hidden rounded"
            style={{
              backgroundColor: 'var(--cream)',
              border: '1px solid var(--warm-border)',
            }}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className="text-sm font-semibold rounded-full w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--cream-light)' }}
                  >
                    📚
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Mis Cursos
                    </dt>
                    <dd
                      className="text-lg font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {loadingStats ? '...' : stats.myCourses}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div
              className="px-5 py-3"
              style={{ backgroundColor: 'var(--cream-light)', borderTop: '1px solid var(--warm-border)' }}
            >
              <div className="text-sm">
                <Link
                  href="/professor/courses"
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent)' }}
                >
                  Gestionar cursos
                </Link>
              </div>
            </div>
          </div>

          <div
            className="card-warm overflow-hidden rounded"
            style={{
              backgroundColor: 'var(--cream)',
              border: '1px solid var(--warm-border)',
            }}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className="text-sm font-semibold rounded-full w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--cream-light)' }}
                  >
                    📝
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Entregas Recibidas
                    </dt>
                    <dd
                      className="text-lg font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {loadingStats ? '...' : stats.submissions}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div
              className="px-5 py-3"
              style={{ backgroundColor: 'var(--cream-light)', borderTop: '1px solid var(--warm-border)' }}
            >
              <div className="text-sm">
                <Link
                  href="/professor/submissions"
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent)' }}
                >
                  Ver entregas
                </Link>
              </div>
            </div>
          </div>

          <div
            className="card-warm overflow-hidden rounded"
            style={{
              backgroundColor: 'var(--cream)',
              border: '1px solid var(--warm-border)',
            }}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className="text-sm font-semibold rounded-full w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--cream-light)' }}
                  >
                    👤
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Estudiantes
                    </dt>
                    <dd
                      className="text-lg font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {loadingStats ? '...' : stats.students}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div
              className="px-5 py-3"
              style={{ backgroundColor: 'var(--cream-light)', borderTop: '1px solid var(--warm-border)' }}
            >
              <div className="text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Estudiantes activos</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded p-6"
          style={{
            backgroundColor: 'var(--cream)',
            border: '1px solid var(--warm-border)',
          }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--text-primary)' }}
          >
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/professor/courses"
              className="p-4 rounded transition-all hover:shadow-sm"
              style={{
                border: '1px solid var(--warm-border)',
                backgroundColor: 'var(--cream-light)',
              }}
            >
              <h3
                className="font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Mis Cursos
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Crear y gestionar tus cursos
              </p>
            </Link>
            <Link
              href="/careers"
              className="p-4 rounded transition-all hover:shadow-sm"
              style={{
                border: '1px solid var(--warm-border)',
                backgroundColor: 'var(--cream-light)',
              }}
            >
              <h3
                className="font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Ver Carreras
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Ver las carreras donde están tus cursos
              </p>
            </Link>
            <Link
              href="/professor/submissions"
              className="p-4 rounded transition-all hover:shadow-sm"
              style={{
                border: '1px solid var(--warm-border)',
                backgroundColor: 'var(--cream-light)',
              }}
            >
              <h3
                className="font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Ver Entregas
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Revisar entregas de tus estudiantes
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

