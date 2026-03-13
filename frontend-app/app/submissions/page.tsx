'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

interface Submission {
  id: number;
  project_url: string;
  submitted_at: string;
  course: {
    id: number;
    title: string;
  };
  evaluation?: {
    score: number;
    feedback_summary: string;
    provider: string;
  };
}

export default function SubmissionsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
    }
  }, [isAuthenticated]);

  async function loadSubmissions() {
    const response = await api.getSubmissions();
    if (response.data) {
      setSubmissions(response.data);
    }
    setLoadingSubmissions(false);
  }

  function getScoreColor(score: number) {
    if (score >= 18) return 'text-[var(--success)] bg-[var(--success-bg)]';
    if (score >= 14) return 'text-[var(--accent)] bg-[var(--cream)]';
    if (score >= 11) return 'text-[var(--warning)] bg-[var(--warning-bg)]';
    return 'text-[var(--error)] bg-[var(--error-bg)]';
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-primary)]"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] font-serif">Mis Entregas</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Gestiona y revisa todas tus entregas de proyectos
          </p>
        </div>

        {loadingSubmissions ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--text-secondary)]">Cargando entregas...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-[var(--cream-light)] rounded-lg border border-[var(--warm-border)] p-8 text-center">
            <p className="text-[var(--text-secondary)] mb-4">No has realizado ninguna entrega aún.</p>
            <button
              onClick={() => router.push('/courses')}
              className="bg-[var(--btn-primary)] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Explorar Cursos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-[var(--cream-light)] rounded-lg border border-[var(--warm-border)] hover:border-[var(--accent)] transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 font-serif">
                      {submission.course.title}
                    </h3>
                    <a
                      href={submission.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:text-[var(--accent)]/80 text-sm"
                    >
                      {submission.project_url}
                    </a>
                    <p className="text-sm text-[var(--text-muted)] mt-2">
                      Enviado: {new Date(submission.submitted_at).toLocaleString('es-PE')}
                    </p>
                  </div>
                  {submission.evaluation && (
                    <div
                      className={`px-4 py-2 rounded-lg font-bold text-lg border border-[var(--warm-border)] ${getScoreColor(
                        submission.evaluation.score
                      )}`}
                    >
                      {submission.evaluation.score.toFixed(1)}/20
                    </div>
                  )}
                </div>

                {submission.evaluation ? (
                  <div className="mt-4 pt-4 border-t border-[var(--warm-border)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        Evaluación ({submission.evaluation.provider})
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        Calificación: {submission.evaluation.score.toFixed(1)}/20
                      </span>
                    </div>
                    <p className="text-[var(--text-secondary)] bg-[var(--cream)] rounded-lg p-4 border border-[var(--warm-border)]">
                      {submission.evaluation.feedback_summary}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-[var(--warm-border)]">
                    <div className="flex items-center text-[var(--warning)]">
                      <span className="text-sm">
                        ⏳ Evaluación en proceso...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

