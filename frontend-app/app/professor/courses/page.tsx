'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

interface CareerCurriculum {
  id: number;
  order_index: number;
  career: {
    id: number;
    name: string;
    status: string;
  };
}

interface Course {
  id: number;
  title: string;
  description: string;
  credits: number;
  price: number;
  base_price?: number;
  professor: {
    id: number;
    full_name: string;
  };
  careerCurriculums?: CareerCurriculum[];
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

        // Para cada curso, obtener los detalles completos (incluyendo carreras)
        const coursesWithCareers = await Promise.all(
          myCourses.map(async (course: Course) => {
            try {
              const courseDetail = await api.getCourse(course.id);
              return courseDetail.data || course;
            } catch (error) {
              console.error(`Error loading course ${course.id}:`, error);
              return course;
            }
          })
        );

        setCourses(coursesWithCareers);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  }

  async function handleCreate() {
    if (!user?.id) return;

    // Validar campos requeridos
    if (!formData.title || formData.title.trim() === '') {
      alert('El título del curso es requerido');
      return;
    }

    if (formData.credits <= 0) {
      alert('Los créditos deben ser mayor a 0');
      return;
    }

    try {
      const response = await api.createCourse({
        professor_id: user.id,
        title: formData.title.trim(),
        description: formData.description || undefined,
        credits: formData.credits,
        base_price: formData.price > 0 ? formData.price : undefined,
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
        alert('Curso creado exitosamente');
      } else {
        alert(response.error || 'Error al crear curso');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error al crear curso. Verifica la consola para más detalles.');
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--text-primary)' }}></div>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'profesor') {
    return null;
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>Mis Cursos</h1>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
              Gestiona tus cursos y contenido educativo
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ backgroundColor: 'var(--btn-primary)' }}
            className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            + Crear Curso
          </button>
        </div>

        {loadingCourses ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: 'var(--text-primary)' }}></div>
            <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Cargando cursos...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-lg shadow p-8 text-center card-warm" style={{ backgroundColor: 'white', border: '1px solid var(--warm-border)' }}>
            <p style={{ color: 'var(--text-secondary)' }} className="mb-4">No has creado cursos aún.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{ backgroundColor: 'var(--btn-primary)' }}
              className="text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Crear tu primer curso
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-lg shadow hover:shadow-lg transition-shadow p-6 card-warm"
                style={{ backgroundColor: 'white', border: '1px solid var(--warm-border)' }}
              >
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {course.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>
                <div className="flex items-center justify-between text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  <span>Cursos: {course.credits} créditos</span>
                  <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                    S/ {course.base_price || course.price}
                  </span>
                </div>

                {/* Mostrar carreras donde está el curso */}
                {course.careerCurriculums && course.careerCurriculums.length > 0 && (
                  <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--cream-light)', border: '1px solid var(--warm-border)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      En {course.careerCurriculums.length} {course.careerCurriculums.length === 1 ? 'carrera' : 'carreras'}:
                    </p>
                    <div className="space-y-1">
                      {course.careerCurriculums.map((curriculum) => (
                        <div key={curriculum.id} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          • {curriculum.career.name}
                          <span style={{ color: 'var(--text-muted)' }} className="ml-1">
                            (Mes {curriculum.order_index})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!course.careerCurriculums || course.careerCurriculums.length === 0) && (
                  <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--cream-light)', border: '1px solid var(--warm-border)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Nota: Este curso aún no está asignado a ninguna carrera
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Link
                    href={`/professor/courses/${course.id}/edit`}
                    style={{ backgroundColor: 'var(--success)' }}
                    className="flex-1 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity text-center"
                  >
                    Editar Contenido
                  </Link>
                  <Link
                    href={`/courses/${course.id}`}
                    style={{ backgroundColor: 'var(--accent)' }}
                    className="flex-1 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity text-center"
                  >
                    Ver
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id)}
                    style={{ backgroundColor: 'var(--error)' }}
                    className="text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
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
          <div className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md" style={{ backgroundColor: 'white', border: '1px solid var(--warm-border)' }}>
              <div className="mt-3">
                <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  Crear Nuevo Curso
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Título
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ borderColor: 'var(--warm-border)' }}
                      placeholder="Nombre del curso"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ borderColor: 'var(--warm-border)' }}
                      placeholder="Descripción del curso"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
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
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ borderColor: 'var(--warm-border)' }}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
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
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ borderColor: 'var(--warm-border)' }}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleCreate}
                    style={{ backgroundColor: 'var(--btn-primary)' }}
                    className="flex-1 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
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
                    style={{ backgroundColor: 'var(--text-muted)' }}
                    className="flex-1 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
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

