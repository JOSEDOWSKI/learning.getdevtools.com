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
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

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
    
    setCurrentTime(currentTime);
    if (duration > 0 && !isNaN(duration)) {
      setDuration(duration);
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

  function handlePlayPause() {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    if (!videoRef.current) return;
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!videoRef.current) return;
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }

  function handleMuteToggle() {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  }

  function handlePlaybackRateChange(rate: number) {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  }

  function formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function handleVideoLoadStart() {
    setIsVideoLoading(true);
    setVideoError(null);
  }

  function handleVideoCanPlay() {
    setIsVideoLoading(false);
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }

  function handleVideoError() {
    setIsVideoLoading(false);
    setVideoError('Error al cargar el video. Por favor, intenta recargar la página.');
  }

  function handleVideoLoadedMetadata() {
    if (videoRef.current && lesson?.progress?.video_time_watched) {
      // Restaurar posición anterior si existe
      videoRef.current.currentTime = lesson.progress.video_time_watched;
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
            {/* Video Mejorado */}
            {videoUrl && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 p-4 pb-0">
                  Video de la Lección
                </h2>
                <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    className="absolute top-0 left-0 w-full h-full"
                    onTimeUpdate={handleVideoTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onLoadStart={handleVideoLoadStart}
                    onCanPlay={handleVideoCanPlay}
                    onError={handleVideoError}
                    onLoadedMetadata={handleVideoLoadedMetadata}
                    preload="metadata"
                    playsInline
                    src={videoUrl}
                  >
                    Tu navegador no soporta la reproducción de video.
                  </video>

                  {/* Loading Indicator */}
                  {isVideoLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                        <p className="mt-4 text-white text-sm">Cargando video...</p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                      <div className="text-center p-4">
                        <p className="text-red-400 mb-4">{videoError}</p>
                        <button
                          onClick={() => {
                            setVideoError(null);
                            setIsVideoLoading(true);
                            if (videoRef.current) {
                              videoRef.current.load();
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Reintentar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Custom Controls Overlay */}
                  {!isVideoLoading && !videoError && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, #4b5563 ${(currentTime / (duration || 1)) * 100}%, #4b5563 100%)`
                          }}
                        />
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                          {/* Play/Pause */}
                          <button
                            onClick={handlePlayPause}
                            className="p-2 hover:bg-white/20 rounded transition-colors"
                            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                          >
                            {isPlaying ? (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>

                          {/* Volume */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleMuteToggle}
                              className="p-2 hover:bg-white/20 rounded transition-colors"
                              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                            >
                              {isMuted || volume === 0 ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.617-3.793a1 1 0 011.383-.131zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.617-3.793a1 1 0 011.383-.131zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={isMuted ? 0 : volume}
                              onChange={handleVolumeChange}
                              className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          {/* Time Display */}
                          <span className="text-sm font-mono">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Playback Rate */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handlePlaybackRateChange(playbackRate === 0.75 ? 1 : playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : playbackRate === 1.5 ? 2 : 0.75)}
                              className="px-2 py-1 text-sm bg-white/20 hover:bg-white/30 rounded transition-colors"
                            >
                              {playbackRate}x
                            </button>
                          </div>

                          {/* Fullscreen */}
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                if (videoRef.current.requestFullscreen) {
                                  videoRef.current.requestFullscreen();
                                }
                              }
                            }}
                            className="p-2 hover:bg-white/20 rounded transition-colors"
                            aria-label="Pantalla completa"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Summary */}
                <div className="p-4 pt-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progreso de visualización</span>
                    <span>{Math.round(videoProgress)}%</span>
                  </div>
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

