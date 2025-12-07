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
  description: string;
  credits: number;
  price: number;
  professor: {
    id: number;
    full_name: string;
  };
}

export default function ProfessorCoursesPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    credits: 0,
    price: 0,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!loading && isAuthenticated && user?.role !== 'profesor') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, loading, router, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'profesor') {
      loadCourses();
    }
  }, [isAuthenticated, user]);

  async function loadCourses() {
    try {
      setLoadingCourses(true);
      const response = await api.getCourses();
      if (response.data) {
        // Filtrar solo los cursos del profesor actual
        const myCourses = response.data.filter(
          (course: Course) => course.professor?.id === user?.id
        );
        setCourses(myCourses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  }

  async function handleCreate() {
    if (!user?.id) return;

    try {
      const response = await api.createCourse({
        ...formData,
        professor_id: user.id,
      });
      if (response.data) {
        await loadCourses();
        setShowCreateModal(false);
        setFormData({
          title: '',
          description: '',
          credits: 0,
          price: 0,
        });
      } else {
        alert('Error al crear curso');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error al crear curso');
    }
  }

  async function handleDelete(courseId: number) {
    if (!confirm('¿Estás seguro de eliminar este curso?')) {
      return;
    }

    try {
      const response = await api.deleteCourse(courseId);
      if (response.data || !response.error) {
        await loadCourses();
      } else {
        alert('Error al eliminar curso');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error al eliminar curso');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'profesor') {
    return null;
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Cursos</h1>
            <p className="mt-2 text-gray-600">
              Gestiona tus cursos y contenido educativo
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            + Crear Curso
          </button>
        </div>

        {loadingCourses ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando cursos...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No has creado cursos aún.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Crear tu primer curso
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>📚 {course.credits} créditos</span>
                  <span className="text-lg font-bold text-blue-600">
                    ${course.price}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/courses/${course.id}`}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    Ver
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de creación */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Crear Nuevo Curso
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre del curso"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descripción del curso"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Créditos
                      </label>
                      <input
                        type="number"
                        value={formData.credits}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            credits: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleCreate}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Crear
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({
                        title: '',
                        description: '',
                        credits: 0,
                        price: 0,
                      });
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

