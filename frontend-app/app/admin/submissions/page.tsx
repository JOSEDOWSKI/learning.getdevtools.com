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
          <h1 className="text-3xl font-bold text-gray-900">Todas las Entregas</h1>
          <p className="mt-2 text-gray-600">
            Revisa todas las entregas de estudiantes en la plataforma
          </p>
        </div>

        {loadingSubmissions ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando entregas...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No hay entregas aún.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {submissions.map((submission) => (
                <li key={submission.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {submission.student.full_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">
                                {submission.student.full_name}
                              </p>
                              <span className="ml-2 text-xs text-gray-500">
                                ({submission.student.email})
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Curso: <span className="font-medium">{submission.course.title}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Entregado: {new Date(submission.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <a
                            href={submission.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            🔗 Ver Proyecto: {submission.project_url}
                          </a>
                        </div>
                        {submission.evaluation && (
                          <div className="mt-4 bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Evaluación ({submission.evaluation.provider})
                              </span>
                              <span className="text-lg font-bold text-blue-600">
                                {submission.evaluation.score.toFixed(1)}/20
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {submission.evaluation.feedback_summary}
                            </p>
                          </div>
                        )}
                        {!submission.evaluation && (
                          <div className="mt-4 bg-yellow-50 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                              ⏳ Evaluación pendiente
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <Link
                          href={`/submissions/${submission.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
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

