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

interface Course {
  id: number;
  title: string;
  description?: string;
  credits: number;
  base_price: number;
  professor?: { full_name: string };
}

export default function CoursesPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCourses();
    }
  }, [isAuthenticated]);

  async function loadCourses() {
    const response = await api.getCourses();
    if (response.data) {
      setCourses(response.data);
    }
    setLoadingCourses(false);
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="animate-spin rounded-full h-12 w-12" style={{ borderColor: 'var(--text-primary)', borderTopColor: 'transparent', borderWidth: '3px' }}></div>
      </div>
    );
  }

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase()) ||
    c.professor?.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        {/* Header */}
        <div className="mb-8">
          <span className="tag tag-accent mb-3 inline-block">Catalogo</span>
          <h1 className="text-3xl md:text-4xl" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 400, color: 'var(--text-primary)' }}>
            Cursos disponibles
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Cada curso se puede tomar de forma independiente o como parte de una carrera
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, descripcion o profesor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
              style={{ background: '#ffffff', border: '1px solid var(--warm-border)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Results count */}
        {!loadingCourses && (
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} {search && 'encontrado' + (filteredCourses.length !== 1 ? 's' : '')}
          </p>
        )}

        {loadingCourses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--warm-border)', background: '#ffffff' }}>
                <div className="skeleton" style={{ height: 140 }} />
                <div className="p-5 space-y-3">
                  <div className="skeleton" style={{ height: 18, width: '60%' }} />
                  <div className="skeleton" style={{ height: 14, width: '100%' }} />
                  <div className="skeleton" style={{ height: 14, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-xl p-12 text-center" style={{ background: '#ffffff', border: '1px solid var(--warm-border)' }}>
            <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--cream-dark)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {search ? 'Sin resultados' : 'No hay cursos disponibles'}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {search ? 'Intenta con otra busqueda' : 'Proximamente se publicaran cursos nuevos'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, idx) => (
              <Link href={`/courses/${course.id}`} key={course.id} className="course-card group">
                <div className={`course-card-header ${COURSE_COLORS[idx % COURSE_COLORS.length]}`}>
                  <span className="text-white text-5xl font-bold opacity-20" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    {course.title.charAt(0)}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="tag tag-accent">{course.credits} creditos</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--text-primary)' }}>
                    {course.title}
                  </h3>
                  {course.description && (
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {course.description}
                    </p>
                  )}
                  {course.professor && (
                    <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                      Prof. {course.professor.full_name}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--warm-border)' }}>
                    <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      S/ {course.base_price}
                    </span>
                    <span className="text-sm font-medium px-4 py-2 rounded-lg btn-primary">
                      Ver curso
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
