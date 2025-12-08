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
  const [lessons, setLessons] = useState<any[]>([]);
  const [courseProgress, setCourseProgress] = useState<any>(null);
  const [loadingLessons, setLoadingLessons] = useState(false);

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

  useEffect(() => {
    if (hasAccess && courseId) {
      loadLessons();
      loadCourseProgress();
    }
  }, [hasAccess, courseId]);

  async function loadCourse() {
    if (!courseId || isNaN(courseId) || courseId <= 0) {
      router.push('/courses');
      return;
    }

    try {
      setLoadingCourse(true);
      const response = await api.getCourse(courseId);
      if (response.data) {
        setCourse(response.data);
      } else {
        router.push('/courses');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      router.push('/courses');
    } finally {
      setLoadingCourse(false);
    }
  }

  async function checkAccess() {
    if (!courseId || isNaN(courseId) || courseId <= 0) {
      return;
    }

    try {
      const response = await api.checkAccess(courseId);
      if (response.data) {
        setHasAccess(response.data.hasAccess || false);
      }
    } catch (error) {
      console.error('Error checking access:', error);
    }
  }

  async function loadLessons() {
    if (!courseId) return;
    try {
      setLoadingLessons(true);
      const response = await api.getLessons(courseId);
      if (response.data) {
        setLessons(response.data);
      }
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoadingLessons(false);
    }
  }

  async function loadCourseProgress() {
    if (!courseId) return;
    try {
      const response = await api.getCourseProgress(courseId);
      if (response.data) {
        setCourseProgress(response.data);
      }
    } catch (error) {
      console.error('Error loading course progress:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!submissionUrl.trim()) return;

    if (!courseId || isNaN(courseId) || courseId <= 0) {
      alert('ID de curso inválido');
      return;
    }

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
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Lecciones del Curso
                </h2>
                {loadingLessons ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Cargando lecciones...</p>
                  </div>
                ) : lessons.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    No hay lecciones disponibles aún.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lessons
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((lesson) => {
                        const progress = courseProgress?.lessons?.find(
                          (l: any) => l.id === lesson.id
                        )?.progress;
                        const progressPercent = progress?.progress_percentage || 0;
                        const isCompleted = progress?.is_completed || false;

                        return (
                          <div
                            key={lesson.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    #{lesson.order_index + 1}
                                  </span>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {lesson.title}
                                  </h3>
                                  {isCompleted && (
                                    <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                                      ✓ Completada
                                    </span>
                                  )}
                                </div>
                                {progressPercent > 0 && (
                                  <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div
                                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                                        style={{ width: `${progressPercent}%` }}
                                      ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {Math.round(progressPercent)}% completado
                                    </p>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  router.push(`/courses/${courseId}/lessons/${lesson.id}`)
                                }
                                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                              >
                                {progressPercent > 0 ? 'Continuar' : 'Comenzar'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
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
                  <div className="pt-4 border-t space-y-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      ✓ Tienes acceso
                    </span>
                    {courseProgress && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progreso del Curso</span>
                          <span className="font-medium">
                            {courseProgress.completedLessons} / {courseProgress.totalLessons} lecciones
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${courseProgress.overallProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round(courseProgress.overallProgress)}% completado
                        </p>
                      </div>
                    )}
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

