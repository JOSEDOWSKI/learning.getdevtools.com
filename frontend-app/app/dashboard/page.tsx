'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

const COURSE_COLORS = [
  'color-band-1', 'color-band-2', 'color-band-3', 'color-band-4',
  'color-band-5', 'color-band-6', 'color-band-7', 'color-band-8',
];

interface CourseAccess {
  id: number;
  course: {
    id: number;
    title: string;
    description?: string;
    credits: number;
    professor?: { full_name: string };
  };
}

export default function DashboardPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [myAccess, setMyAccess] = useState<CourseAccess[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<number, any>>({});
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!loading && isAuthenticated && user) {
      if (user.role === 'super_admin') { router.push('/admin/dashboard'); return; }
      if (user.role === 'profesor') { router.push('/professor/dashboard'); return; }
    }
  }, [isAuthenticated, loading, router, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'alumno') {
      loadAllData();
    }
  }, [isAuthenticated, user]);

  async function loadAllData() {
    try {
      const [accessRes, coursesRes, careersRes, certsRes, subsRes] = await Promise.all([
        api.getMyAccess().catch(() => ({ data: [] })),
        api.getCourses().catch(() => ({ data: [] })),
        api.getCareers().catch(() => ({ data: [] })),
        api.getCertificates().catch(() => ({ data: [] })),
        api.getSubmissions().catch(() => ({ data: [] })),
      ]);

      const access = accessRes.data || [];
      setMyAccess(access);
      setAllCourses(coursesRes.data || []);
      setCareers(careersRes.data || []);
      setCertificates(certsRes.data || []);
      setSubmissions(subsRes.data || []);

      // Load progress for each enrolled course
      const progressMap: Record<number, any> = {};
      await Promise.all(
        access.map(async (a: CourseAccess) => {
          try {
            const prog = await api.getCourseProgress(a.course.id);
            if (prog.data) progressMap[a.course.id] = prog.data;
          } catch (e) { /* ignore */ }
        })
      );
      setCourseProgress(progressMap);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--text-primary)' }}></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const enrolledCourses = myAccess.map(a => a.course);
  const getProgress = (courseId: number) => courseProgress[courseId];

  // Find the course with most recent progress to "continue"
  const continueCourse = enrolledCourses.find(c => {
    const prog = getProgress(c.id);
    return prog && prog.overallProgress > 0 && prog.overallProgress < 100;
  }) || enrolledCourses[0];

  return (
    <Layout>
      <div className="px-4 sm:px-0 space-y-8">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
              Bienvenido de vuelta
            </p>
            <h1
              className="text-3xl md:text-4xl"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, color: 'var(--text-primary)' }}
            >
              {user.full_name}
            </h1>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg btn-primary"
          >
            Explorar cursos
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Mis Cursos', value: enrolledCourses.length, href: '/courses', color: 'var(--accent)' },
            { label: 'Carreras', value: careers.length, href: '/careers', color: 'var(--nav-gold)' },
            { label: 'Entregas', value: submissions.length, href: '/submissions', color: 'var(--warning)' },
            { label: 'Certificados', value: certificates.length, href: '/certificates', color: 'var(--success)' },
          ].map((stat, i) => (
            <Link
              key={i}
              href={stat.href}
              className="rounded-xl p-5 transition-all"
              style={{ background: '#ffffff', border: '1px solid var(--warm-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              <p className="text-3xl font-bold stat-number" style={{ color: stat.color, fontFamily: "'Source Serif 4', Georgia, serif" }}>
                {loadingData ? '-' : stat.value}
              </p>
            </Link>
          ))}
        </div>

        {/* Continue Learning - Featured Card */}
        {continueCourse && !loadingData && (
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-elevated)' }}
          >
            <div className="p-6 md:p-8 relative z-10">
              <span className="tag" style={{ background: 'rgba(201,169,110,0.2)', color: '#e0c48a' }}>
                Continuar aprendiendo
              </span>
              <h2 className="text-2xl md:text-3xl mt-4 mb-2" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: '#ffffff' }}>
                {continueCourse.title}
              </h2>
              {continueCourse.professor && (
                <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Prof. {continueCourse.professor.full_name}
                </p>
              )}

              {/* Progress bar */}
              {getProgress(continueCourse.id) && (
                <div className="mb-6 max-w-md">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Progreso</span>
                    <span style={{ color: '#e0c48a' }}>
                      {getProgress(continueCourse.id).completedLessons}/{getProgress(continueCourse.id).totalLessons} lecciones
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <div
                      className="h-2 rounded-full no-transition"
                      style={{ background: '#c9a96e', width: `${getProgress(continueCourse.id).overallProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <Link
                href={`/courses/${continueCourse.id}`}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg"
                style={{ background: '#c9a96e', color: '#1a1a1a' }}
              >
                Continuar curso →
              </Link>
            </div>
          </div>
        )}

        {/* My Enrolled Courses */}
        {enrolledCourses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600 }}>
                Mis cursos
              </h2>
              <Link href="/courses" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {enrolledCourses.map((course, idx) => {
                const prog = getProgress(course.id);
                const percent = prog?.overallProgress || 0;
                return (
                  <Link href={`/courses/${course.id}`} key={course.id} className="course-card group">
                    <div className={`course-card-header ${COURSE_COLORS[idx % COURSE_COLORS.length]}`}>
                      <span className="text-white text-4xl font-bold opacity-20" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                        {course.title.charAt(0)}
                      </span>
                      {/* Progress overlay */}
                      {percent > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                          <div className="flex justify-between text-xs text-white mb-1">
                            <span>{Math.round(percent)}%</span>
                            <span>{prog?.completedLessons}/{prog?.totalLessons}</span>
                          </div>
                          <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.3)' }}>
                            <div className="h-1.5 rounded-full no-transition" style={{ background: '#ffffff', width: `${percent}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--text-primary)' }}>
                        {course.title}
                      </h3>
                      {course.professor && (
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {course.professor.full_name}
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="tag tag-accent text-xs">
                          {percent === 100 ? 'Completado' : percent > 0 ? 'En progreso' : 'Sin iniciar'}
                        </span>
                        <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loadingData && enrolledCourses.length === 0 && (
          <div className="rounded-xl p-12 text-center" style={{ background: '#ffffff', border: '1px solid var(--warm-border)' }}>
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="text-xl mb-2" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600 }}>
                Empieza tu aprendizaje
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Explora nuestro catalogo de cursos y carreras para comenzar tu camino profesional.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/courses" className="px-6 py-2.5 text-sm font-medium rounded-lg btn-primary">
                  Ver cursos
                </Link>
                <Link href="/careers" className="px-6 py-2.5 text-sm font-medium rounded-lg btn-outline">
                  Ver carreras
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {enrolledCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/submissions"
              className="rounded-xl p-5 transition-all group"
              style={{ background: '#ffffff', border: '1px solid var(--warm-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Mis Entregas</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {submissions.length} entrega{submissions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="text-lg" style={{ color: 'var(--accent)' }}>→</span>
              </div>
            </Link>
            <Link
              href="/certificates"
              className="rounded-xl p-5 transition-all group"
              style={{ background: '#ffffff', border: '1px solid var(--warm-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Certificados</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {certificates.length} certificado{certificates.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="text-lg" style={{ color: 'var(--accent)' }}>→</span>
              </div>
            </Link>
            <Link
              href="/careers"
              className="rounded-xl p-5 transition-all group"
              style={{ background: '#ffffff', border: '1px solid var(--warm-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Carreras</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Explora rutas de aprendizaje
                  </p>
                </div>
                <span className="text-lg" style={{ color: 'var(--accent)' }}>→</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
