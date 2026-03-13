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
  video_url: string | null;
  pdf_url: string | null;
  video_filename: string | null;
  pdf_filename: string | null;
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
  const [uploadingVideo, setUploadingVideo] = useState<number | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState<number | null>(null);

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

  async function handleFileUpload(lessonId: number, file: File, type: 'video' | 'pdf') {
    if (type === 'video') {
      setUploadingVideo(lessonId);
    } else {
      setUploadingPdf(lessonId);
    }

    try {
      const response = type === 'video'
        ? await api.uploadVideo(lessonId, file)
        : await api.uploadPdf(lessonId, file);

      if (response.data) {
        alert(`${type === 'video' ? 'Video' : 'PDF'} subido exitosamente`);
        await loadLessons();
      } else {
        alert(response.error || `Error al subir ${type === 'video' ? 'video' : 'PDF'}`);
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      alert(`Error al subir ${type === 'video' ? 'video' : 'PDF'}`);
    } finally {
      if (type === 'video') {
        setUploadingVideo(null);
      } else {
        setUploadingPdf(null);
      }
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: 'var(--text-primary)' }}></div>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="rounded-lg shadow p-8 text-center card-warm" style={{ backgroundColor: 'white', border: '1px solid var(--warm-border)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Curso no encontrado.</p>
        </div>
      </Layout>
    );
  }

  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index);

  return (
    <Layout>
      <div className="px-4 sm:px-0" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="mb-8">
          <button
            onClick={() => router.push('/professor/courses')}
            style={{ color: 'var(--accent)' }}
            className="hover:opacity-80 mb-4"
          >
            ← Volver a Mis Cursos
          </button>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Editar Curso: {course.title}
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Gestiona el contenido y las lecciones de tu curso
          </p>
        </div>

        <div className="rounded-lg shadow p-6 mb-6 card-warm" style={{ backgroundColor: 'white', border: '1px solid var(--warm-border)' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>Lecciones</h2>
            <button
              onClick={openCreateLessonModal}
              style={{ backgroundColor: 'var(--btn-primary)' }}
              className="text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              + Agregar Lección
            </button>
          </div>

          {loadingLessons ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: 'var(--text-primary)' }}></div>
              <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Cargando lecciones...</p>
            </div>
          ) : sortedLessons.length === 0 ? (
            <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
              <p>No hay lecciones aún. Crea tu primera lección para comenzar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  style={{ borderColor: 'var(--warm-border)' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium px-2 py-1 rounded" style={{ backgroundColor: 'var(--cream-light)', color: 'var(--text-secondary)', border: '1px solid var(--warm-border)' }}>
                          #{lesson.order_index + 1}
                        </span>
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>
                          {lesson.title}
                        </h3>
                      </div>
                      {lesson.content && (
                        <p style={{ color: 'var(--text-secondary)' }} className="text-sm line-clamp-2 mb-3">
                          {lesson.content}
                        </p>
                      )}
                      <div className="flex gap-4 mt-3">
                        {lesson.video_url ? (
                          <span className="text-sm" style={{ color: 'var(--success)' }}>Video subido</span>
                        ) : (
                          <label className="text-sm cursor-pointer" style={{ color: 'var(--accent)' }}>
                            Subir Video
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(lesson.id, file, 'video');
                              }}
                              disabled={uploadingVideo === lesson.id}
                            />
                          </label>
                        )}
                        {lesson.pdf_url ? (
                          <span className="text-sm" style={{ color: 'var(--success)' }}>PDF subido</span>
                        ) : (
                          <label className="text-sm cursor-pointer" style={{ color: 'var(--accent)' }}>
                            Subir PDF
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(lesson.id, file, 'pdf');
                              }}
                              disabled={uploadingPdf === lesson.id}
                            />
                          </label>
                        )}
                        {(uploadingVideo === lesson.id || uploadingPdf === lesson.id) && (
                          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Subiendo...</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openEditLessonModal(lesson)}
                        style={{ color: 'var(--accent)' }}
                        className="hover:opacity-80 font-medium text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        style={{ color: 'var(--error)' }}
                        className="hover:opacity-80 font-medium text-sm"
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
        <div className="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md" style={{ backgroundColor: 'white', border: '1px solid var(--warm-border)' }}>
            <div className="mt-3">
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>
                {editingLesson ? 'Editar Lección' : 'Nueva Lección'}
              </h3>
              <form onSubmit={handleSaveLesson} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Título de la Lección *
                  </label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, title: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ borderColor: 'var(--warm-border)' }}
                    placeholder="Ej: Introducción a React"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Contenido
                  </label>
                  <textarea
                    value={lessonForm.content}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, content: e.target.value })
                    }
                    rows={10}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ borderColor: 'var(--warm-border)' }}
                    placeholder="Escribe el contenido de la lección aquí. Puedes usar Markdown para formatear el texto."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
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
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ borderColor: 'var(--warm-border)' }}
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    El orden determina la secuencia de las lecciones (0 = primera, 1 = segunda, etc.)
                  </p>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowLessonModal(false)}
                    style={{ backgroundColor: 'var(--text-muted)' }}
                    className="flex-1 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{ backgroundColor: 'var(--btn-primary)' }}
                    className="flex-1 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
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

