'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

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
      professor?: {
        id: number;
        full_name: string;
      };
    };
  }>;
}

export default function CareersPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [myCourses, setMyCourses] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCareers();
      if (user?.role === 'profesor') {
        loadMyCourses();
      }
    }
  }, [isAuthenticated, user]);

  async function loadCareers() {
    const response = await api.getCareers();
    if (response.data) {
      // Para cada carrera, obtener los detalles completos con curriculum
      const careersWithDetails = await Promise.all(
        response.data.map(async (career: Career) => {
          try {
            const careerDetail = await api.getCareer(career.id);
            return careerDetail.data || career;
          } catch (error) {
            console.error(`Error loading career ${career.id}:`, error);
            return career;
          }
        })
      );
      setCareers(careersWithDetails);
    }
    setLoadingCareers(false);
  }

  async function loadMyCourses() {
    try {
      const response = await api.getCourses();
      if (response.data) {
        const myCoursesList = response.data.filter(
          (course: any) => course.professor?.id === user?.id
        );
        setMyCourses(myCoursesList);
      }
    } catch (error) {
      console.error('Error loading my courses:', error);
    }
  }

  // Función para obtener los cursos del profesor en una carrera
  function getMyCoursesInCareer(career: Career): number {
    if (!career.curriculum || !user?.id) return 0;
    return career.curriculum.filter(
      (item) => item.course.professor_id === user.id
    ).length;
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carreras</h1>
          <p className="mt-2 text-gray-600">
            {user?.role === 'profesor' 
              ? 'Carreras donde están tus cursos. El administrador asigna los cursos a las carreras.'
              : 'Explora las carreras completas de 24 meses'}
          </p>
          {user?.role === 'profesor' && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Proceso:</strong> Crea tus cursos en "Mis Cursos" y el administrador los asignará a las carreras correspondientes.
              </p>
            </div>
          )}
        </div>

        {loadingCareers ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando carreras...</p>
          </div>
        ) : careers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No hay carreras disponibles aún.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {careers.map((career) => (
              <div
                key={career.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      {career.name}
                    </h3>
                    <p className="text-gray-600">{career.description}</p>
                    {user?.role === 'profesor' && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          📚 {getMyCoursesInCareer(career)} de tus cursos en esta carrera
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {career.total_months} meses
                    </span>
                    {career.status === 'active' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Activa
                      </span>
                    )}
                    {career.status === 'draft' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Borrador
                      </span>
                    )}
                  </div>
                </div>

                {career.curriculum && career.curriculum.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Plan de Estudios ({career.curriculum.length} cursos)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {career.curriculum
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((item) => {
                          const isMyCourse = user?.role === 'profesor' && item.course.professor_id === user?.id;
                          return (
                            <div
                              key={item.course.id}
                              className={`rounded-lg p-3 text-sm ${
                                isMyCourse 
                                  ? 'bg-green-50 border border-green-200' 
                                  : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <span className="font-medium text-gray-500">
                                    Mes {item.order_index}:
                                  </span>{' '}
                                  <Link
                                    href={`/courses/${item.course.id}`}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    {item.course.title}
                                  </Link>
                                  {item.course.professor && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Prof: {item.course.professor.full_name}
                                    </p>
                                  )}
                                </div>
                                {isMyCourse && (
                                  <span className="ml-2 text-xs text-green-600 font-semibold">
                                    ✓ Tu curso
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t">
                  <Link
                    href={`/careers/${career.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Ver detalles completos →
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

