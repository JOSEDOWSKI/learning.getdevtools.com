'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

interface Course {
  id: number;
  title: string;
  description?: string;
  credits: number;
  base_price: number;
  professor?: {
    full_name: string;
  };
}

export default function CoursesPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

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

  return (
    <Layout>
      <div className="px-4 sm:px-0" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>Cursos Disponibles</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Explora todos los cursos disponibles en la plataforma
          </p>
        </div>

        {loadingCourses ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 mx-auto" style={{ borderColor: 'var(--text-primary)', borderTopColor: 'transparent', borderWidth: '3px' }}></div>
            <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Cargando cursos...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-lg p-8 text-center" style={{ backgroundColor: 'var(--cream-light)', border: '1px solid var(--warm-border)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No hay cursos disponibles aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-lg p-6 hover:shadow-md transition-shadow"
                style={{ backgroundColor: 'var(--cream-light)', border: '2px solid var(--warm-border)' }}
              >
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {course.title}
                </h3>
                {course.description && (
                  <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                    {course.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm mb-4">
                  <span style={{ color: 'var(--text-muted)' }}>{course.credits} créditos</span>
                  {course.professor && (
                    <span style={{ color: 'var(--text-muted)' }}>{course.professor.full_name}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                    S/ {course.base_price}
                  </span>
                  <Link
                    href={`/courses/${course.id}`}
                    className="text-white px-4 py-2 rounded text-sm font-medium transition-colors hover:opacity-90"
                    style={{ backgroundColor: 'var(--btn-primary)' }}
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

