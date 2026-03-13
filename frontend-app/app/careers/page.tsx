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

interface Career {
  id: number;
  name: string;
  description: string;
  total_months: number;
  status: string;
  curriculum?: Array<{
    order_index: number;
    course: {
      id: number;
      title: string;
      professor_id?: number;
      professor?: { id: number; full_name: string };
    };
  }>;
}

export default function CareersPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [expandedCareer, setExpandedCareer] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) loadCareers();
  }, [isAuthenticated]);

  async function loadCareers() {
    const response = await api.getCareers();
    if (response.data) {
      const careersWithDetails = await Promise.all(
        response.data.map(async (career: Career) => {
          try {
            const detail = await api.getCareer(career.id);
            return detail.data || career;
          } catch { return career; }
        })
      );
      setCareers(careersWithDetails);
    }
    setLoadingCareers(false);
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="animate-spin rounded-full h-12 w-12" style={{ borderColor: 'var(--text-primary)', borderTopColor: 'transparent', borderWidth: '3px' }}></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        {/* Header */}
        <div className="mb-10">
          <span className="tag tag-dark mb-3 inline-block">Rutas de aprendizaje</span>
          <h1 className="text-3xl md:text-4xl" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 400, color: 'var(--text-primary)' }}>
            Carreras
          </h1>
          <p className="mt-2 text-sm max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Una carrera agrupa cursos especificos en un plan estructurado de {careers[0]?.total_months || 24} meses.
            Tambien puedes tomar cada curso de forma independiente.
          </p>
        </div>

        {/* How careers work */}
        <div className="rounded-xl p-6 mb-10" style={{ background: '#ffffff', border: '1px solid var(--warm-border)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Cursos independientes</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Compra y toma cualquier curso por separado</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Sigue la ruta</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>O elige una carrera y avanza paso a paso</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Obtiene tu titulo</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Completa todos los cursos y certificate</p>
              </div>
            </div>
          </div>
        </div>

        {loadingCareers ? (
          <div className="space-y-6">
            {[1,2].map(i => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--warm-border)', background: '#ffffff' }}>
                <div className="p-8 space-y-4">
                  <div className="skeleton" style={{ height: 28, width: '40%' }} />
                  <div className="skeleton" style={{ height: 16, width: '70%' }} />
                  <div className="flex gap-3 mt-4">
                    {[1,2,3,4].map(j => <div key={j} className="skeleton" style={{ height: 60, width: 180 }} />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : careers.length === 0 ? (
          <div className="rounded-xl p-12 text-center" style={{ background: '#ffffff', border: '1px solid var(--warm-border)' }}>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No hay carreras disponibles</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Proximamente se publicaran las carreras.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {careers.map((career) => {
              const isExpanded = expandedCareer === career.id;
              const sortedCurriculum = career.curriculum
                ? [...career.curriculum].sort((a, b) => a.order_index - b.order_index)
                : [];

              return (
                <div
                  key={career.id}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{ background: '#ffffff', border: '1px solid var(--warm-border)', boxShadow: 'var(--shadow-card)' }}
                >
                  {/* Career header */}
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {career.status === 'active' && <span className="tag tag-success">Activa</span>}
                          {career.status === 'draft' && (
                            <span className="tag" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>Borrador</span>
                          )}
                          <span className="tag tag-accent">{career.total_months} meses</span>
                          <span className="tag tag-accent">{sortedCurriculum.length} cursos</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600 }}>
                          {career.name}
                        </h2>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{career.description}</p>
                      </div>
                    </div>

                    {/* Course timeline preview */}
                    {sortedCurriculum.length > 0 && (
                      <div className="mt-6">
                        <button
                          onClick={() => setExpandedCareer(isExpanded ? null : career.id)}
                          className="text-sm font-medium mb-4 flex items-center gap-1"
                          style={{ color: 'var(--accent)' }}
                        >
                          {isExpanded ? 'Ocultar' : 'Ver'} plan de estudios
                          <svg
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>

                        {/* Compact horizontal preview */}
                        {!isExpanded && (
                          <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            {sortedCurriculum.slice(0, 6).map((item, idx) => (
                              <div key={item.course.id} className="flex items-center shrink-0">
                                <div
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                                  style={{ background: 'var(--cream-light)', border: '1px solid var(--warm-border)' }}
                                >
                                  <span
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                                  >
                                    {idx + 1}
                                  </span>
                                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.course.title}</span>
                                </div>
                                {idx < Math.min(sortedCurriculum.length, 6) - 1 && (
                                  <span className="mx-1" style={{ color: 'var(--warm-border)' }}>→</span>
                                )}
                              </div>
                            ))}
                            {sortedCurriculum.length > 6 && (
                              <span className="text-sm shrink-0 px-2" style={{ color: 'var(--text-muted)' }}>
                                +{sortedCurriculum.length - 6} mas
                              </span>
                            )}
                          </div>
                        )}

                        {/* Expanded vertical timeline */}
                        {isExpanded && (
                          <div className="space-y-0 ml-1">
                            {sortedCurriculum.map((item, idx) => {
                              const colorClass = COURSE_COLORS[idx % COURSE_COLORS.length];
                              const isLast = idx === sortedCurriculum.length - 1;

                              return (
                                <div key={item.course.id} className="flex gap-4" style={{ paddingBottom: isLast ? 0 : 4 }}>
                                  {/* Timeline line + dot */}
                                  <div className="flex flex-col items-center shrink-0">
                                    <div
                                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold z-10"
                                      style={{ background: 'var(--accent)', color: '#ffffff', border: '3px solid #ffffff', boxShadow: '0 0 0 2px var(--accent)' }}
                                    >
                                      {idx + 1}
                                    </div>
                                    {!isLast && (
                                      <div className="w-0.5 flex-1 min-h-[20px]" style={{ background: 'var(--warm-border)' }} />
                                    )}
                                  </div>

                                  {/* Course card */}
                                  <Link
                                    href={`/courses/${item.course.id}`}
                                    className="flex-1 mb-3 rounded-xl overflow-hidden transition-all group"
                                    style={{ border: '1px solid var(--warm-border)', background: 'var(--cream-light)' }}
                                  >
                                    <div className={`h-2 ${colorClass}`} />
                                    <div className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                                            Mes {item.order_index}
                                          </p>
                                          <h4 className="font-semibold" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--text-primary)' }}>
                                            {item.course.title}
                                          </h4>
                                          {item.course.professor && (
                                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                              Prof. {item.course.professor.full_name}
                                            </p>
                                          )}
                                        </div>
                                        <span className="text-sm font-medium shrink-0" style={{ color: 'var(--accent)' }}>
                                          Ver →
                                        </span>
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
