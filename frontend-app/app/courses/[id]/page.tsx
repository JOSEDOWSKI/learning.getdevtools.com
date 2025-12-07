'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

export default function CourseDetailPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id ? parseInt(params.id as string, 10) : null;
  const [course, setCourse] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    // Validar que courseId sea un número válido
    if (isAuthenticated && courseId && !isNaN(courseId) && courseId > 0) {
      loadCourse();
      checkAccess();
    } else if (courseId === null || isNaN(courseId) || courseId <= 0) {
      // Si el ID no es válido, redirigir a la lista de cursos
      router.push('/courses');
    }
  }, [isAuthenticated, courseId, router]);

  async function loadCourse() {
    const response = await api.getCourse(courseId);
    if (response.data) {
      setCourse(response.data);
    }
    setLoadingCourse(false);
  }

  async function checkAccess() {
    const response = await api.checkAccess(courseId);
    if (response.data) {
      setHasAccess(response.data.hasAccess || false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!submissionUrl.trim()) return;

    setSubmitting(true);
    const response = await api.createSubmission(courseId, submissionUrl);
    if (response.data) {
      alert('Entrega enviada exitosamente. La evaluación se procesará automáticamente.');
      setSubmissionUrl('');
      router.push('/submissions');
    } else {
      alert(response.error || 'Error al enviar la entrega');
    }
    setSubmitting(false);
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (loadingCourse) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando curso...</p>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Curso no encontrado.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          {course.professor && (
            <p className="mt-2 text-gray-600">Profesor: {course.professor.full_name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Descripción
              </h2>
              <p className="text-gray-700">
                {course.description || 'No hay descripción disponible.'}
              </p>
            </div>

            {course.rubric && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Rúbrica de Evaluación
                </h2>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded">
                    {course.rubric}
                  </pre>
                </div>
              </div>
            )}

            {hasAccess && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Enviar Entrega
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL del Proyecto
                    </label>
                    <input
                      type="url"
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      placeholder="https://github.com/usuario/proyecto"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Ingresa la URL de tu repositorio o proyecto
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Enviando...' : 'Enviar Entrega'}
                  </button>
                </form>
              </div>
            )}

            {!hasAccess && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">
                  ⚠️ No tienes acceso a este curso. Contacta al administrador para obtener acceso.
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información del Curso
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Créditos</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {course.credits}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Precio</span>
                  <p className="text-lg font-semibold text-blue-600">
                    S/ {course.base_price}
                  </p>
                </div>
                {hasAccess && (
                  <div className="pt-4 border-t">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      ✓ Tienes acceso
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

