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

  if (!isAuthenticated || user?.role !== 'super_admin') {
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
            Panel de Administración
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Bienvenido, {user?.full_name || 'Administrador'}
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
                    👤
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Usuarios
                    </dt>
                    <dd
                      className="text-lg font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {loadingStats ? '...' : stats.users}
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
                  href="/admin/users"
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent)' }}
                >
                  Gestionar usuarios
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
                      Cursos
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
                  href="/admin/courses"
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
                      Entregas
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
                  href="/admin/submissions"
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent)' }}
                >
                  Ver todas las entregas
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
                  href="/admin/certificates"
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent)' }}
                >
                  Ver certificados
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
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/users"
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
                Gestionar Usuarios
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Ver, editar y cambiar roles de usuarios
              </p>
            </Link>
            <Link
              href="/admin/careers"
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
                Gestionar Carreras
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Crear planes de carrera y asociar cursos
              </p>
            </Link>
            <Link
              href="/admin/courses"
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
                Ver Todos los Cursos
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Ver todos los cursos creados por profesores
              </p>
            </Link>
            <Link
              href="/admin/submissions"
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
                Revisar todas las entregas de estudiantes
              </p>
            </Link>
            <Link
              href="/admin/certificates"
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
                Ver y gestionar todos los certificados
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

