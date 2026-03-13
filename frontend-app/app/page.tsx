'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const COURSE_COLORS = [
  'color-band-1', 'color-band-2', 'color-band-3', 'color-band-4',
  'color-band-5', 'color-band-6', 'color-band-7', 'color-band-8',
];

interface Course {
  id: number;
  title: string;
  description?: string;
  credits: number;
  base_price: number;
  professor?: { full_name: string };
}

interface Career {
  id: number;
  name: string;
  description: string;
  total_months: number;
  status: string;
  curriculum?: Array<{ order_index: number; course: { id: number; title: string } }>;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [coursesRes, careersRes] = await Promise.all([
          api.getCourses().catch(() => ({ data: [] })),
          api.getCareers().catch(() => ({ data: [] })),
        ]);
        setCourses((coursesRes.data || []).slice(0, 6));
        setCareers((careersRes.data || []).filter((c: Career) => c.status === 'active').slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Gold top bar */}
      <div className="nav-gold-bar" />

      {/* Navigation */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid var(--warm-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span
              className="text-lg tracking-tight"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, color: 'var(--text-primary)' }}
            >
              DEVTOOLS
            </span>
            <div className="flex items-center space-x-6">
              <Link href="/courses" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Cursos
              </Link>
              <Link href="/careers" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Carreras
              </Link>
              <Link
                href="/login"
                className="text-sm px-4 py-2 rounded-lg btn-primary"
              >
                Iniciar Sesion
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dark like Platzi */}
      <section className="hero-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 fade-in-up">
              <span className="tag" style={{ background: 'rgba(201,169,110,0.2)', color: '#e0c48a' }}>
                Plataforma educativa
              </span>
            </div>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight fade-in-up fade-in-up-delay-1"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 400, color: '#ffffff' }}
            >
              Domina el{' '}
              <span className="text-gradient">desarrollo</span>
              <br />
              de software
            </h1>
            <p className="text-lg md:text-xl mb-10 max-w-2xl fade-in-up fade-in-up-delay-2" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
              Cursos independientes o carreras completas de 24 meses.
              Certificaciones verificables y evaluacion con inteligencia artificial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 fade-in-up fade-in-up-delay-3">
              <Link
                href="/register?role=alumno"
                className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-lg"
                style={{ background: '#c9a96e', color: '#1a1a1a' }}
              >
                Comenzar gratis
              </Link>
              <Link
                href="#courses"
                className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-lg"
                style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', background: 'rgba(255,255,255,0.05)' }}
              >
                Explorar cursos
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg fade-in-up fade-in-up-delay-4">
            {[
              { value: courses.length || '10+', label: 'Cursos' },
              { value: careers.length || '3+', label: 'Carreras' },
              { value: '24', label: 'Meses' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-gradient" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {stat.value}
                </p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ background: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="tag tag-accent mb-4">Como funciona</span>
            <h2 className="text-3xl md:text-4xl mt-4" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 400 }}>
              Tu camino de aprendizaje
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Elige tu ruta',
                desc: 'Compra cursos individuales o inscribete en una carrera completa de 24 meses con plan de estudios estructurado.',
              },
              {
                step: '02',
                title: 'Aprende a tu ritmo',
                desc: 'Video clases, material PDF, notas personales y seguimiento de progreso en cada leccion.',
              },
              {
                step: '03',
                title: 'Certifica tu conocimiento',
                desc: 'Entrega tu proyecto, recibe evaluacion con IA y obtiene certificados verificables con firma digital.',
              },
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-xl" style={{ background: 'var(--cream-light)', border: '1px solid var(--warm-border)' }}>
                <span className="text-5xl font-bold" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--cream-dark)' }}>
                  {item.step}
                </span>
                <h3 className="text-xl mt-4 mb-3" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600 }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section id="courses" className="py-20" style={{ background: 'var(--cream)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="tag tag-accent mb-4">Catalogo</span>
              <h2 className="text-3xl md:text-4xl mt-4" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 400 }}>
                Cursos disponibles
              </h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Cada curso se puede tomar de forma independiente
              </p>
            </div>
            <Link href="/courses" className="text-sm font-medium hidden md:block" style={{ color: 'var(--accent)' }}>
              Ver todos →
            </Link>
          </div>

          {!loaded ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--warm-border)' }}>
                  <div className="skeleton" style={{ height: 140 }} />
                  <div className="p-6 space-y-3">
                    <div className="skeleton" style={{ height: 20, width: '70%' }} />
                    <div className="skeleton" style={{ height: 14, width: '100%' }} />
                    <div className="skeleton" style={{ height: 14, width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 rounded-xl" style={{ background: 'var(--cream-light)', border: '1px solid var(--warm-border)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Proximamente se publicaran los cursos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, idx) => (
                <Link href={`/courses/${course.id}`} key={course.id} className="course-card group">
                  <div className={`course-card-header ${COURSE_COLORS[idx % COURSE_COLORS.length]}`}>
                    <span className="text-white text-4xl font-bold opacity-20" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                      {course.title.charAt(0)}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="tag tag-accent">{course.credits} creditos</span>
                      {course.professor && (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{course.professor.full_name}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--text-primary)' }}>
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                        {course.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--warm-border)' }}>
                      <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        S/ {course.base_price}
                      </span>
                      <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                        Ver curso →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link href="/courses" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
              Ver todos los cursos →
            </Link>
          </div>
        </div>
      </section>

      {/* Careers / Learning Paths */}
      {careers.length > 0 && (
        <section className="py-20" style={{ background: '#ffffff' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="tag tag-dark mb-4">Carreras</span>
              <h2 className="text-3xl md:text-4xl mt-4" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 400 }}>
                Rutas de aprendizaje completas
              </h2>
              <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Combina cursos en una carrera estructurada de 24 meses. Avanza paso a paso y obtiene tu titulo.
              </p>
            </div>

            <div className="space-y-6">
              {careers.map((career) => (
                <Link
                  href={`/careers/${career.id}`}
                  key={career.id}
                  className="block rounded-xl p-6 md:p-8 transition-all"
                  style={{ background: 'var(--cream-light)', border: '1px solid var(--warm-border)' }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-semibold" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                        {career.name}
                      </h3>
                      <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{career.description}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="tag tag-accent">{career.total_months} meses</span>
                      <span className="tag tag-accent">{career.curriculum?.length || 0} cursos</span>
                    </div>
                  </div>

                  {career.curriculum && career.curriculum.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {career.curriculum
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((item, idx) => (
                          <div key={item.course.id} className="flex items-center shrink-0">
                            <div
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                              style={{ background: 'var(--cream)', border: '1px solid var(--warm-border)' }}
                            >
                              <span className="font-bold text-xs" style={{ color: 'var(--accent)' }}>{idx + 1}</span>
                              <span style={{ color: 'var(--text-primary)' }}>{item.course.title}</span>
                            </div>
                            {idx < (career.curriculum?.length || 0) - 1 && (
                              <span className="mx-1" style={{ color: 'var(--text-muted)' }}>→</span>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/careers"
                className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium rounded-lg btn-outline"
              >
                Ver todas las carreras
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-20" style={{ background: 'var(--cream)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 400 }}>
            Comienza hoy
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Crea tu cuenta, elige un curso o una carrera completa, y empieza a aprender a tu ritmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?role=alumno"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-lg btn-primary"
            >
              Crear cuenta gratuita
            </Link>
            <Link
              href="/register?role=profesor"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-lg btn-outline"
            >
              Quiero ser profesor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', color: 'rgba(255,255,255,0.5)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span
              className="text-lg tracking-tight"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, color: '#ffffff' }}
            >
              DEVTOOLS
            </span>
            <p className="text-sm">DevTools Learning Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
