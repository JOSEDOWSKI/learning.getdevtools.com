'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

interface Lesson {
  id: number;
  title: string;
  content: string;
  order_index: number;
  course_id: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  credits: number;
  base_price: number;
  professor_id: number;
}

export default function EditCoursePage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id ? parseInt(params.id as string, 10) : null;
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    order_index: 0,
  });
  const [saving, setSaving] = useState(false);

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
    if (isAuthenticated && user?.role === 'profesor' && courseId && !isNaN(courseId) && courseId > 0) {
      loadCourse();
      loadLessons();
    } else if (courseId === null || isNaN(courseId) || courseId <= 0) {
      router.push('/professor/courses');
    }
  }, [isAuthenticated, user, courseId, router]);

  async function loadCourse() {
    if (!courseId || isNaN(courseId) || courseId <= 0) return;

    try {
      setLoadingCourse(true);
      const response = await api.getCourse(courseId);
      if (response.data) {
        // Verificar que el curso pertenece al profesor
        if (response.data.professor_id !== user?.id) {
          alert('No tienes permiso para editar este curso');
          router.push('/professor/courses');
          return;
        }
        setCourse(response.data);
      } else {
        router.push('/professor/courses');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      router.push('/professor/courses');
    } finally {
      setLoadingCourse(false);
    }
  }

  async function loadLessons() {
    if (!courseId || isNaN(courseId) || courseId <= 0) return;

    try {
      setLoadingLessons(true);
      const response = await api.getLessons(courseId);
      if (response.data) {
        setLessons(response.data);
      }
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoadingLessons(false);
    }
  }

  function openCreateLessonModal() {
    setEditingLesson(null);
    setLessonForm({
      title: '',
      content: '',
      order_index: lessons.length,
    });
    setShowLessonModal(true);
  }

  function openEditLessonModal(lesson: Lesson) {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      content: lesson.content || '',
      order_index: lesson.order_index,
    });
    setShowLessonModal(true);
  }

  async function handleSaveLesson(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId || !lessonForm.title.trim()) return;

    setSaving(true);
    try {
      if (editingLesson) {
        // Actualizar lección existente
        const response = await api.updateLesson(editingLesson.id, {
          title: lessonForm.title.trim(),
          content: lessonForm.content.trim() || undefined,
          order_index: lessonForm.order_index,
        });
        if (response.data) {
          await loadLessons();
          setShowLessonModal(false);
        } else {
          alert(response.error || 'Error al actualizar lección');
        }
      } else {
        // Crear nueva lección
        const response = await api.createLesson({
          course_id: courseId,
          title: lessonForm.title.trim(),
          content: lessonForm.content.trim() || undefined,
          order_index: lessonForm.order_index,
        });
        if (response.data) {
          await loadLessons();
          setShowLessonModal(false);
        } else {
          alert(response.error || 'Error al crear lección');
        }
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Error al guardar lección');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteLesson(lessonId: number) {
    if (!confirm('¿Estás seguro de eliminar esta lección?')) return;

    try {
      const response = await api.deleteLesson(lessonId);
      if (response.data || !response.error) {
        await loadLessons();
      } else {
        alert('Error al eliminar lección');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Error al eliminar lección');
    }
  }

  if (loading || loadingCourse || !isAuthenticated || user?.role !== 'profesor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Curso no encontrado.</p>
        </div>
      </Layout>
    );
  }

  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index);

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <button
            onClick={() => router.push('/professor/courses')}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Volver a Mis Cursos
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Curso: {course.title}
          </h1>
          <p className="mt-2 text-gray-600">
            Gestiona el contenido y las lecciones de tu curso
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Lecciones</h2>
            <button
              onClick={openCreateLessonModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              + Agregar Lección
            </button>
          </div>

          {loadingLessons ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando lecciones...</p>
            </div>
          ) : sortedLessons.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No hay lecciones aún. Crea tu primera lección para comenzar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{lesson.order_index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lesson.title}
                        </h3>
                      </div>
                      {lesson.content && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {lesson.content}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openEditLessonModal(lesson)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Lección */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingLesson ? 'Editar Lección' : 'Nueva Lección'}
              </h3>
              <form onSubmit={handleSaveLesson} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la Lección *
                  </label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, title: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Introducción a React"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenido
                  </label>
                  <textarea
                    value={lessonForm.content}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, content: e.target.value })
                    }
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Escribe el contenido de la lección aquí. Puedes usar Markdown para formatear el texto."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orden
                  </label>
                  <input
                    type="number"
                    value={lessonForm.order_index}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        order_index: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    El orden determina la secuencia de las lecciones (0 = primera, 1 = segunda, etc.)
                  </p>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowLessonModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : editingLesson ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

