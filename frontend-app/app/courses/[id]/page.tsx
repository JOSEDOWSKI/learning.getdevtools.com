'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

const COURSE_COLORS = [
  'color-band-1', 'color-band-2', 'color-band-3', 'color-band-4',
  'color-band-5', 'color-band-6', 'color-band-7', 'color-band-8',
];

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
    if (!loading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated && courseId && !isNaN(courseId) && courseId > 0) {
      loadCourse();
      checkAccess();
    } else if (courseId === null || isNaN(courseId as number) || (courseId as number) <= 0) {
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
    if (!courseId || isNaN(courseId) || courseId <= 0) { router.push('/courses'); return; }
    try {
      setLoadingCourse(true);
      const response = await api.getCourse(courseId);
      if (response.data) setCourse(response.data);
      else router.push('/courses');
    } catch { router.push('/courses'); }
    finally { setLoadingCourse(false); }
  }

  async function checkAccess() {
    if (!courseId || isNaN(courseId) || courseId <= 0) return;
    try {
      const response = await api.checkAccess(courseId);
      if (response.data) setHasAccess(response.data.hasAccess || false);
    } catch { /* ignore */ }
  }

  async function loadLessons() {
    if (!courseId) return;
    try {
      setLoadingLessons(true);
      const response = await api.getLessons(courseId);
      if (response.data) setLessons(response.data);
    } catch { /* ignore */ }
    finally { setLoadingLessons(false); }
  }

  async function loadCourseProgress() {
    if (!courseId) return;
    try {
      const response = await api.getCourseProgress(courseId);
      if (response.data) setCourseProgress(response.data);
    } catch { /* ignore */ }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!submissionUrl.trim() || !courseId || isNaN(courseId) || courseId <= 0) return;
    setSubmitting(true);
    const response = await api.createSubmission(courseId, submissionUrl);
    if (response.data) {
      alert('Entrega enviada exitosamente. La evaluacion se procesara automaticamente.');
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
        <div className="px-4 sm:px-0 space-y-6">
          <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
          <div className="skeleton" style={{ height: 24, width: '50%' }} />
          <div className="skeleton" style={{ height: 16, width: '80%' }} />
          <div className="skeleton" style={{ height: 16, width: '60%' }} />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="rounded-xl p-12 text-center" style={{ background: '#ffffff', border: '1px solid var(--warm-border)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Curso no encontrado.</p>
        </div>
      </Layout>
    );
  }

  const overallProgress = courseProgress?.overallProgress || 0;
  const colorClass = COURSE_COLORS[(courseId || 0) % COURSE_COLORS.length];

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        {/* Back button */}
        <button onClick={() => router.back()} className="text-sm mb-6 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <span>←</span> Volver a cursos
        </button>

        {/* Course Header Banner */}
        <div className={`rounded-xl overflow-hidden mb-8 ${colorClass}`} style={{ position: 'relative' }}>
          <div className="p-8 md:p-10" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                    {course.credits} creditos
                  </span>
                  {hasAccess && (
                    <span className="tag" style={{ background: 'rgba(5,150,105,0.3)', color: '#86efac' }}>
                      Inscrito
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl mb-2" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: '#ffffff', fontWeight: 600 }}>
                  {course.title}
                </h1>
                {course.professor && (
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Prof. {course.professor.full_name}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                <p className="text-3xl font-bold" style={{ color: '#ffffff', fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  S/ {course.base_price}
                </p>
              </div>
            </div>

            {/* Progress bar for enrolled users */}
            {hasAccess && courseProgress && (
              <div className="mt-6 max-w-md">
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Progreso del curso</span>
                  <span style={{ color: '#ffffff' }}>
                    {courseProgress.completedLessons}/{courseProgress.totalLessons} lecciones
                  </span>
                </div>
                <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <div className="h-2 rounded-full no-transition" style={{ background: '#ffffff', width: `${overallProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid var(--warm-border)' }}>
              <h2 className="text-xl mb-4" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600 }}>
                Descripcion
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {course.description || 'No hay descripcion disponible.'}
              </p>
            </div>

            {/* Rubric */}
            {course.rubric && (
              <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid var(--warm-border)' }}>
                <h2 className="text-xl mb-4" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600 }}>
                  Rubrica de Evaluacion
                </h2>
                <pre className="whitespace-pre-wrap text-sm p-4 rounded-lg" style={{ background: 'var(--cream)', border: '1px solid var(--warm-border)', color: 'var(--text-secondary)' }}>
                  {course.rubric}
                </pre>
              </div>
            )}

            {/* Lessons / Syllabus */}
            {hasAccess && (
              <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid var(--warm-border)' }}>
                <h2 className="text-xl mb-6" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600 }}>
                  Contenido del curso
                </h2>
                {loadingLessons ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 60 }} />)}
                  </div>
                ) : lessons.length === 0 ? (
                  <p className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    No hay lecciones disponibles aun.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {lessons
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((lesson, idx) => {
                        const progress = courseProgress?.lessons?.find((l: any) => l.id === lesson.id)?.progress;
                        const progressPercent = progress?.progress_percentage || 0;
                        const isCompleted = progress?.is_completed || false;

                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer group"
                            style={{ border: '1px solid var(--warm-border)', background: isCompleted ? 'var(--success-bg)' : 'var(--cream-light)' }}
                            onClick={() => router.push(`/courses/${courseId}/lessons/${lesson.id}`)}
                          >
                            {/* Step number / status */}
                            <div
                              className="step-dot shrink-0"
                              style={isCompleted
                                ? { background: 'var(--success)', color: '#fff', border: '2px solid var(--success)' }
                                : progressPercent > 0
                                  ? { background: 'var(--accent)', color: '#fff', border: '2px solid var(--accent)' }
                                  : { background: 'var(--cream-dark)', color: 'var(--text-muted)', border: '2px solid var(--warm-border)' }
                              }
                            >
                              {isCompleted ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                {lesson.title}
                              </h3>
                              {progressPercent > 0 && !isCompleted && (
                                <div className="mt-2 flex items-center gap-2">
                                  <div className="flex-1 rounded-full h-1.5" style={{ background: 'var(--cream-dark)' }}>
                                    <div className="h-1.5 rounded-full no-transition" style={{ background: 'var(--accent)', width: `${progressPercent}%` }} />
                                  </div>
                                  <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>{Math.round(progressPercent)}%</span>
                                </div>
                              )}
                            </div>

                            <span className="text-sm font-medium shrink-0" style={{ color: 'var(--accent)' }}>
                              {isCompleted ? 'Repasar' : progressPercent > 0 ? 'Continuar' : 'Comenzar'} →
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* Submission form */}
            {hasAccess && (
              <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid var(--warm-border)' }}>
                <h2 className="text-xl mb-4" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600 }}>
                  Enviar proyecto
                </h2>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Envia la URL de tu proyecto para recibir evaluacion automatica con IA.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="url"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://github.com/usuario/proyecto"
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm"
                    style={{ border: '1px solid var(--warm-border)', background: 'var(--cream-light)', color: 'var(--text-primary)' }}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl text-sm font-medium btn-primary disabled:opacity-50"
                  >
                    {submitting ? 'Enviando...' : 'Enviar entrega'}
                  </button>
                </form>
              </div>
            )}

            {/* No access */}
            {!hasAccess && !loadingCourse && (
              <div className="rounded-xl p-8 text-center" style={{ background: 'var(--warning-bg)', border: '1px solid rgba(180,83,9,0.2)' }}>
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(180,83,9,0.1)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <p className="font-semibold mb-1" style={{ color: 'var(--warning)' }}>Acceso requerido</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Contacta al administrador para obtener acceso a este curso.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="rounded-xl p-6 sticky top-6" style={{ background: '#ffffff', border: '1px solid var(--warm-border)', boxShadow: 'var(--shadow-card)' }}>
              <h3 className="text-lg mb-5" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600 }}>
                Informacion
              </h3>
              <div className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Creditos</p>
                  <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{course.credits}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Precio</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>S/ {course.base_price}</p>
                </div>
                {course.professor && (
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Profesor</p>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{course.professor.full_name}</p>
                  </div>
                )}
                {lessons.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Lecciones</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{lessons.length}</p>
                  </div>
                )}

                {hasAccess && courseProgress && (
                  <div className="pt-4" style={{ borderTop: '1px solid var(--warm-border)' }}>
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: 'var(--text-muted)' }}>Progreso</span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{Math.round(overallProgress)}%</span>
                    </div>
                    <div className="w-full rounded-full h-2.5" style={{ background: 'var(--cream-dark)' }}>
                      <div className="h-2.5 rounded-full no-transition" style={{ background: overallProgress === 100 ? 'var(--success)' : 'var(--accent)', width: `${overallProgress}%` }} />
                    </div>
                    <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                      {courseProgress.completedLessons} de {courseProgress.totalLessons} lecciones completadas
                    </p>
                  </div>
                )}

                {hasAccess && (
                  <span className="tag tag-success w-full justify-center py-2">
                    Tienes acceso
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
