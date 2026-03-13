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
      return;
    }
    // Redirigir según el rol si no es alumno
    if (!loading && isAuthenticated && user) {
      if (user.role === 'super_admin') {
        router.push('/admin/dashboard');
        return;
      }
      if (user.role === 'profesor') {
        router.push('/professor/dashboard');
        return;
      }
    }
  }, [isAuthenticated, loading, router, user]);

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

  if (!isAuthenticated && !loading) {
    return null; // El useEffect manejará la redirección
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: 'var(--text-primary)' }}
          ></div>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Cargando usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--text-primary)' }}
          >
            Bienvenido, {user?.full_name || 'Usuario'}
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            {user?.role === 'alumno' && 'Estudiante'}
            {user?.role === 'profesor' && 'Profesor'}
            {user?.role === 'super_admin' && 'Administrador'}
            {!user?.role && 'Usuario'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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
                      Cursos Disponibles
                    </dt>
                    <dd
                      className="text-lg font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {loadingStats ? '...' : stats.courses}
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
                  href="/courses"
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent)' }}
                >
                  Ver todos
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
                    📚
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Carreras
                    </dt>
                    <dd
                      className="text-lg font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {loadingStats ? '...' : stats.careers}
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
                  href="/careers"
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent)' }}
                >
                  Ver todas
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
                      Mis Entregas
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
                  href="/submissions"
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent)' }}
                >
                  Ver todas
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
                    ✓
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Certificados
                    </dt>
                    <dd
                      className="text-lg font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {loadingStats ? '...' : stats.certificates}
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
                  href="/certificates"
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent)' }}
                >
                  Ver todos
                </Link>
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
            Accesos Rápidos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/courses"
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
                Explorar Cursos
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Ver todos los cursos disponibles
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
                Explora las carreras completas
              </p>
            </Link>
            <Link
              href="/submissions"
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
                Mis Entregas
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Ver y gestionar tus entregas
              </p>
            </Link>
            <Link
              href="/certificates"
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
                Certificados
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Ver tus certificados obtenidos
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

