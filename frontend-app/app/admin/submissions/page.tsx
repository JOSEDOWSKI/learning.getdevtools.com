'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

interface Submission {
  id: number;
  project_url: string;
  course: {
    id: number;
    title: string;
  };
  student: {
    id: number;
    full_name: string;
    email: string;
  };
  evaluation?: {
    score: number;
    feedback_summary: string;
    provider: string;
  };
  created_at: string;
}

export default function AdminSubmissionsPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

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
      loadSubmissions();
    }
  }, [isAuthenticated, user]);

  async function loadSubmissions() {
    try {
      setLoadingSubmissions(true);
      const response = await api.getSubmissions();
      if (response.data) {
        setSubmissions(response.data);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoadingSubmissions(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--text-secondary)]">Cargando...</p>
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
          <h1 className="text-3xl font-bold text-[var(--text-primary)] font-serif">Todas las Entregas</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Revisa todas las entregas de estudiantes en la plataforma
          </p>
        </div>

        {loadingSubmissions ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--text-secondary)]">Cargando entregas...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-[var(--cream-light)] rounded-lg border border-[var(--warm-border)] p-8 text-center">
            <p className="text-[var(--text-secondary)]">No hay entregas aún.</p>
          </div>
        ) : (
          <div className="bg-[var(--cream-light)] border border-[var(--warm-border)] overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-[var(--warm-border)]">
              {submissions.map((submission) => (
                <li key={submission.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                              <span className="text-[var(--accent)] font-semibold">
                                {submission.student.full_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-[var(--text-primary)]">
                                {submission.student.full_name}
                              </p>
                              <span className="ml-2 text-xs text-[var(--text-muted)]">
                                ({submission.student.email})
                              </span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                              Curso: <span className="font-medium">{submission.course.title}</span>
                            </p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">
                              Entregado: {new Date(submission.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <a
                            href={submission.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--accent)] hover:text-[var(--accent)]/80 text-sm font-medium"
                          >
                            Ver Proyecto: {submission.project_url}
                          </a>
                        </div>
                        {submission.evaluation && (
                          <div className="mt-4 bg-[var(--cream)] rounded-lg p-4 border border-[var(--warm-border)]">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-[var(--text-primary)]">
                                Evaluación ({submission.evaluation.provider})
                              </span>
                              <span className="text-lg font-bold text-[var(--accent)]">
                                {submission.evaluation.score.toFixed(1)}/20
                              </span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {submission.evaluation.feedback_summary}
                            </p>
                          </div>
                        )}
                        {!submission.evaluation && (
                          <div className="mt-4 bg-[var(--warning-bg)] rounded-lg p-4">
                            <p className="text-sm text-[var(--warning)]">
                              ⏳ Evaluación pendiente
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <Link
                          href={`/submissions/${submission.id}`}
                          className="bg-[var(--btn-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}

