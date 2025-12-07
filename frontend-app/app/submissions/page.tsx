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
    if (score >= 18) return 'text-green-600 bg-green-100';
    if (score >= 14) return 'text-blue-600 bg-blue-100';
    if (score >= 11) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Entregas</h1>
          <p className="mt-2 text-gray-600">
            Gestiona y revisa todas tus entregas de proyectos
          </p>
        </div>

        {loadingSubmissions ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando entregas...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No has realizado ninguna entrega aún.</p>
            <button
              onClick={() => router.push('/courses')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Explorar Cursos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {submission.course.title}
                    </h3>
                    <a
                      href={submission.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      🔗 {submission.project_url}
                    </a>
                    <p className="text-sm text-gray-500 mt-2">
                      Enviado: {new Date(submission.submitted_at).toLocaleString('es-PE')}
                    </p>
                  </div>
                  {submission.evaluation && (
                    <div
                      className={`px-4 py-2 rounded-lg font-bold text-lg ${getScoreColor(
                        submission.evaluation.score
                      )}`}
                    >
                      {submission.evaluation.score.toFixed(1)}/20
                    </div>
                  )}
                </div>

                {submission.evaluation ? (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Evaluación ({submission.evaluation.provider})
                      </span>
                      <span className="text-xs text-gray-500">
                        Calificación: {submission.evaluation.score.toFixed(1)}/20
                      </span>
                    </div>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                      {submission.evaluation.feedback_summary}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center text-yellow-600">
                      <span className="animate-spin mr-2">⏳</span>
                      <span className="text-sm">
                        Evaluación en proceso...
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

