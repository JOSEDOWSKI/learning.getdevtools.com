'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
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
    id: number;
    course_id: number;
    order_index: number;
    course: {
      id: number;
      title: string;
      credits: number;
    };
  }>;
}

interface Course {
  id: number;
  title: string;
  credits: number;
  professor: {
    full_name: string;
  };
}

export default function CareerPlanPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const careerId = params.id ? parseInt(params.id as string, 10) : null;
  const [career, setCareer] = useState<Career | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [orderIndex, setOrderIndex] = useState(1);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!loading && isAuthenticated && user?.role !== 'super_admin') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, loading, router, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'super_admin' && careerId) {
      loadData();
    }
  }, [isAuthenticated, user, careerId]);

  async function loadData() {
    if (!careerId || isNaN(careerId) || careerId <= 0) {
      router.push('/admin/careers');
      return;
    }

    try {
      setLoadingData(true);
      const [careerRes, coursesRes] = await Promise.all([
        api.getCareer(careerId),
        api.getCourses(),
      ]);

      if (careerRes.data) {
        setCareer(careerRes.data);
        // Calcular el siguiente order_index
        const maxOrder = Math.max(
          ...(careerRes.data.curriculum?.map((c: { order_index: number }) => c.order_index) || [0]),
          0
        );
        setOrderIndex(maxOrder + 1);
      }

      if (coursesRes.data) {
        setAllCourses(coursesRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      router.push('/admin/careers');
    } finally {
      setLoadingData(false);
    }
  }

  async function handleAddCourse() {
    if (!selectedCourseId || !careerId) return;

    try {
      const response = await api.addCourseToCareer(
        careerId,
        selectedCourseId,
        orderIndex
      );
      if (response.data) {
        await loadData();
        setShowAddModal(false);
        setSelectedCourseId(null);
      } else {
        alert('Error al agregar curso a la carrera');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Error al agregar curso a la carrera');
    }
  }

  async function handleRemoveCourse(courseId: number) {
    if (!careerId) return;

    if (!confirm('¿Estás seguro de quitar este curso de la carrera?')) {
      return;
    }

    try {
      const response = await api.removeCourseFromCareer(careerId, courseId);
      if (response.data || !response.error) {
        await loadData();
      } else {
        alert('Error al quitar curso de la carrera');
      }
    } catch (error) {
      console.error('Error removing course:', error);
      alert('Error al quitar curso de la carrera');
    }
  }

  // Obtener cursos que ya están en la carrera
  const coursesInCareer = career?.curriculum?.map((c: { course_id: number }) => c.course_id) || [];
  const availableCourses = allCourses.filter(
    (course) => !coursesInCareer.includes(course.id)
  );

  // Ordenar curriculum por order_index
  const sortedCurriculum = career?.curriculum
    ? [...career.curriculum].sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
    : [];

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'super_admin' || !career) {
    return null;
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/careers')}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Volver a Carreras
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Plan de Estudios: {career.name}
          </h1>
          <p className="mt-2 text-gray-600">{career.description}</p>
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              📅 {career.total_months} meses
            </span>
            <span className="text-sm text-gray-500">
              📚 {sortedCurriculum.length} cursos
            </span>
            {sortedCurriculum.length < 24 && (
              <span className="text-sm text-yellow-600">
                ⚠️ Mínimo 24 cursos para completar la carrera
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            disabled={availableCourses.length === 0}
          >
            + Agregar Curso a la Carrera
          </button>
        </div>

        {sortedCurriculum.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">
              Esta carrera aún no tiene cursos asignados.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Agrega al menos 24 cursos para completar el plan de estudios.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              disabled={availableCourses.length === 0}
            >
              Agregar Primer Curso
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Cursos en el Plan de Estudios ({sortedCurriculum.length}/24 mínimo)
              </h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {sortedCurriculum.map((item, index) => (
                <li key={item.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {item.order_index}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.course.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.course.credits} créditos
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCourse(item.course_id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal para agregar curso */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Agregar Curso a la Carrera
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seleccionar Curso
                    </label>
                    <select
                      value={selectedCourseId || ''}
                      onChange={(e) =>
                        setSelectedCourseId(
                          e.target.value ? parseInt(e.target.value, 10) : null
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecciona un curso...</option>
                      {availableCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title} ({course.credits} créditos) -{' '}
                          {course.professor?.full_name}
                        </option>
                      ))}
                    </select>
                    {availableCourses.length === 0 && (
                      <p className="mt-2 text-sm text-gray-500">
                        No hay cursos disponibles. Crea cursos primero desde{' '}
                        <Link
                          href="/professor/courses"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          aquí
                        </Link>
                        .
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orden en el Plan (Mes/Posición)
                    </label>
                    <input
                      type="number"
                      value={orderIndex}
                      onChange={(e) =>
                        setOrderIndex(parseInt(e.target.value) || 1)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Este número indica el orden del curso en la carrera (ej: 1
                      = primer mes, 2 = segundo mes, etc.)
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAddCourse}
                    disabled={!selectedCourseId}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Agregar
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedCourseId(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

