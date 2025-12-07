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
    };
  }>;
}

export default function CareersPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loadingCareers, setLoadingCareers] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCareers();
    }
  }, [isAuthenticated]);

  async function loadCareers() {
    const response = await api.getCareers();
    if (response.data) {
      setCareers(response.data);
    }
    setLoadingCareers(false);
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
            Explora las carreras completas de 24 meses
          </p>
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
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {career.total_months} meses
                  </span>
                </div>

                {career.curriculum && career.curriculum.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Plan de Estudios ({career.curriculum.length} cursos)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {career.curriculum
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((item) => (
                          <div
                            key={item.course.id}
                            className="bg-gray-50 rounded-lg p-3 text-sm"
                          >
                            <span className="font-medium text-gray-500">
                              Mes {item.order_index}:
                            </span>{' '}
                            <Link
                              href={`/courses/${item.course.id}`}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {item.course.title}
                            </Link>
                          </div>
                        ))}
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

