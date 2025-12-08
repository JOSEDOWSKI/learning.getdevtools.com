'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

interface LessonProgress {
  is_completed: boolean;
  progress_percentage: number;
  video_time_watched: number;
  notes: string | null;
}

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
  progress: LessonProgress;
}

export default function LessonViewPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id ? parseInt(params.id as string, 10) : null;
  const lessonId = params.lessonId ? parseInt(params.lessonId as string, 10) : null;
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated && lessonId && !isNaN(lessonId) && lessonId > 0) {
      loadLesson();
    } else if (lessonId === null || isNaN(lessonId) || lessonId <= 0) {
      router.push(`/courses/${courseId}`);
    }
  }, [isAuthenticated, lessonId, courseId, router]);

  useEffect(() => {
    if (lesson) {
      setNotes(lesson.progress.notes || '');
      setVideoProgress(lesson.progress.progress_percentage);
      setIsVideoCompleted(lesson.progress.is_completed);
    }
  }, [lesson]);

  async function loadLesson() {
    if (!lessonId || isNaN(lessonId) || lessonId <= 0) return;

    try {
      setLoadingLesson(true);
      const response = await api.getLesson(lessonId);
      if (response.data) {
        setLesson(response.data);
      } else {
        alert(response.error || 'Error al cargar la lección');
        router.push(`/courses/${courseId}`);
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      router.push(`/courses/${courseId}`);
    } finally {
      setLoadingLesson(false);
    }
  }

  async function handleVideoTimeUpdate() {
    if (!videoRef.current || !lesson) return;

    const video = videoRef.current;
    const currentTime = video.currentTime;
    const duration = video.duration;
    
    if (duration > 0) {
      const progress = (currentTime / duration) * 100;
      setVideoProgress(progress);

      // Actualizar progreso cada 10 segundos
      if (Math.floor(currentTime) % 10 === 0) {
        await api.updateLessonProgress(lesson.id, {
          progress_percentage: progress,
          video_time_watched: Math.floor(currentTime),
          is_completed: progress >= 90, // Marcar como completado si vio el 90%
        });
      }

      // Marcar como completado si llegó al final
      if (progress >= 90 && !isVideoCompleted) {
        setIsVideoCompleted(true);
        await api.updateLessonProgress(lesson.id, {
          is_completed: true,
          progress_percentage: 100,
        });
      }
    }
  }

  async function handleSaveNotes() {
    if (!lesson) return;

    setSavingNotes(true);
    try {
      const response = await api.updateLessonNotes(lesson.id, notes);
      if (response.data || !response.error) {
        alert('Notas guardadas exitosamente');
      } else {
        alert('Error al guardar notas');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Error al guardar notas');
    } finally {
      setSavingNotes(false);
    }
  }

  function getVideoUrl() {
    if (!lesson?.video_filename) return null;
    return api.getFileUrl(lesson.video_filename, 'video');
  }

  function getPdfUrl() {
    if (!lesson?.pdf_filename) return null;
    return api.getFileUrl(lesson.pdf_filename, 'pdf');
  }

  if (loading || loadingLesson || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando lección...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <Layout>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Lección no encontrada.</p>
        </div>
      </Layout>
    );
  }

  const videoUrl = getVideoUrl();
  const pdfUrl = getPdfUrl();

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/courses/${courseId}`)}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Volver al Curso
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
          <div className="mt-2 flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Progreso: {Math.round(videoProgress)}%
            </span>
            {isVideoCompleted && (
              <span className="text-sm text-green-600 font-medium">
                ✓ Completada
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video */}
            {videoUrl && (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Video de la Lección
                </h2>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <video
                    ref={videoRef}
                    controls
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    onTimeUpdate={handleVideoTimeUpdate}
                    src={videoUrl}
                  >
                    Tu navegador no soporta la reproducción de video.
                  </video>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${videoProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* PDF */}
            {pdfUrl && (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Material de Lectura
                </h2>
                <iframe
                  src={pdfUrl}
                  className="w-full h-96 rounded-lg border"
                  title="PDF Viewer"
                ></iframe>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-blue-600 hover:text-blue-700"
                >
                  Abrir PDF en nueva pestaña
                </a>
              </div>
            )}

            {/* Contenido de Texto */}
            {lesson.content && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Contenido
                </h2>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded">
                    {lesson.content}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Notas y Progreso */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mis Notas
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                placeholder="Escribe tus notas aquí..."
              />
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {savingNotes ? 'Guardando...' : 'Guardar Notas'}
              </button>

              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Progreso de la Lección
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completado</span>
                    <span className="font-medium">{Math.round(videoProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${videoProgress}%` }}
                    ></div>
                  </div>
                  {isVideoCompleted && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                      ✓ Lección completada
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

