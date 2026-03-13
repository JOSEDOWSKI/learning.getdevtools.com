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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="animate-spin rounded-full h-12 w-12" style={{ borderColor: 'var(--text-primary)', borderTopColor: 'transparent', borderWidth: '3px' }}></div>
      </div>
    );
  }

  if (loadingCourse) {
    return (
      <Layout>
        <div className="text-center py-12" style={{ backgroundColor: 'var(--cream)' }}>
          <div className="animate-spin rounded-full h-12 w-12 mx-auto" style={{ borderColor: 'var(--text-primary)', borderTopColor: 'transparent', borderWidth: '3px' }}></div>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Cargando curso...</p>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="rounded-lg p-8 text-center" style={{ backgroundColor: 'var(--cream-light)', border: '1px solid var(--warm-border)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Curso no encontrado.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="mb-4 transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>{course.title}</h1>
          {course.professor && (
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Profesor: {course.professor.full_name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: 'var(--cream-light)', border: '2px solid var(--warm-border)' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>
                Descripción
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                {course.description || 'No hay descripción disponible.'}
              </p>
            </div>

            {course.rubric && (
              <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: 'var(--cream-light)', border: '2px solid var(--warm-border)' }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  Rúbrica de Evaluación
                </h2>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm p-4 rounded" style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--warm-border)', color: 'var(--text-secondary)' }}>
                    {course.rubric}
                  </pre>
                </div>
              </div>
            )}

            {hasAccess && (
              <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: 'var(--cream-light)', border: '2px solid var(--warm-border)' }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  Lecciones del Curso
                </h2>
                {loadingLessons ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 mx-auto" style={{ borderColor: 'var(--text-primary)', borderTopColor: 'transparent', borderWidth: '2px' }}></div>
                    <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Cargando lecciones...</p>
                  </div>
                ) : lessons.length === 0 ? (
                  <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
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
                            className="rounded-lg p-4 hover:shadow-md transition-shadow"
                            style={{ border: '1px solid var(--warm-border)', backgroundColor: 'var(--cream)' }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-sm font-medium px-2 py-1 rounded" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--cream-light)', border: '1px solid var(--warm-border)' }}>
                                    #{lesson.order_index + 1}
                                  </span>
                                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>
                                    {lesson.title}
                                  </h3>
                                  {isCompleted && (
                                    <span className="text-xs font-medium px-2 py-1 rounded" style={{ color: 'var(--success)', backgroundColor: 'rgba(5, 150, 105, 0.1)', border: '1px solid var(--success)' }}>
                                      Completada
                                    </span>
                                  )}
                                </div>
                                {progressPercent > 0 && (
                                  <div className="mt-2">
                                    <div className="w-full rounded-full h-1.5" style={{ backgroundColor: 'var(--cream-light)', border: '1px solid var(--warm-border)' }}>
                                      <div
                                        className="h-1.5 rounded-full transition-all"
                                        style={{ backgroundColor: 'var(--text-primary)', width: `${progressPercent}%` }}
                                      ></div>
                                    </div>
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                      {Math.round(progressPercent)}% completado
                                    </p>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  router.push(`/courses/${courseId}/lessons/${lesson.id}`)
                                }
                                className="ml-4 text-white px-4 py-2 rounded text-sm font-medium transition-colors hover:opacity-90"
                                style={{ backgroundColor: 'var(--btn-primary)' }}
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
              <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--cream-light)', border: '2px solid var(--warm-border)' }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  Enviar Entrega
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      URL del Proyecto
                    </label>
                    <input
                      type="url"
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      placeholder="https://github.com/usuario/proyecto"
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                      style={{ border: '1px solid var(--warm-border)', backgroundColor: 'var(--cream)', color: 'var(--text-primary)' }}
                    />
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      Ingresa la URL de tu repositorio o proyecto
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full text-white py-3 rounded font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--btn-primary)' }}
                  >
                    {submitting ? 'Enviando...' : 'Enviar Entrega'}
                  </button>
                </form>
              </div>
            )}

            {!hasAccess && (
              <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(180, 83, 9, 0.1)', border: '2px solid var(--warning)' }}>
                <p style={{ color: 'var(--warning)' }}>
                  No tienes acceso a este curso. Contacta al administrador para obtener acceso.
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="rounded-lg p-6 sticky top-6" style={{ backgroundColor: 'var(--cream-light)', border: '2px solid var(--warm-border)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>
                Información del Curso
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Créditos</span>
                  <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {course.credits}
                  </p>
                </div>
                <div>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Precio</span>
                  <p className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>
                    S/ {course.base_price}
                  </p>
                </div>
                {hasAccess && (
                  <div className="pt-4 space-y-3" style={{ borderTop: '1px solid var(--warm-border)' }}>
                    <span className="inline-flex items-center px-3 py-1 rounded text-sm font-medium" style={{ color: 'var(--success)', backgroundColor: 'rgba(5, 150, 105, 0.1)', border: '1px solid var(--success)' }}>
                      Tienes acceso
                    </span>
                    {courseProgress && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: 'var(--text-secondary)' }}>Progreso del Curso</span>
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {courseProgress.completedLessons} / {courseProgress.totalLessons} lecciones
                          </span>
                        </div>
                        <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--warm-border)' }}>
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ backgroundColor: 'var(--success)', width: `${courseProgress.overallProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
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

