'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';

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
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id ? parseInt(params.id as string, 10) : null;
  const lessonId = params.lessonId ? parseInt(params.lessonId as string, 10) : null;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [courseProgress, setCourseProgress] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'contenido' | 'notas'>('contenido');

  useEffect(() => {
    if (!loading && !isAuthenticated) { router.push('/login'); return; }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated && lessonId && !isNaN(lessonId) && lessonId > 0) {
      loadLesson();
    } else if (lessonId === null || isNaN(lessonId as number) || (lessonId as number) <= 0) {
      router.push(`/courses/${courseId}`);
    }
  }, [isAuthenticated, lessonId, courseId, router]);

  useEffect(() => {
    if (isAuthenticated && courseId) {
      loadCourseSidebar();
    }
  }, [isAuthenticated, courseId]);

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
      if (response.data) setLesson(response.data);
      else router.push(`/courses/${courseId}`);
    } catch { router.push(`/courses/${courseId}`); }
    finally { setLoadingLesson(false); }
  }

  async function loadCourseSidebar() {
    if (!courseId) return;
    try {
      const [lessonsRes, progressRes, courseRes] = await Promise.all([
        api.getLessons(courseId),
        api.getCourseProgress(courseId),
        api.getCourse(courseId),
      ]);
      if (lessonsRes.data) setAllLessons(lessonsRes.data.sort((a: any, b: any) => a.order_index - b.order_index));
      if (progressRes.data) setCourseProgress(progressRes.data);
      if (courseRes.data) setCourse(courseRes.data);
    } catch { /* ignore */ }
  }

  async function handleVideoTimeUpdate() {
    if (!videoRef.current || !lesson) return;
    const video = videoRef.current;
    const ct = video.currentTime;
    const dur = video.duration;
    setCurrentTime(ct);
    if (dur > 0 && !isNaN(dur)) {
      setDuration(dur);
      const progress = (ct / dur) * 100;
      setVideoProgress(progress);
      if (Math.floor(ct) % 10 === 0) {
        await api.updateLessonProgress(lesson.id, {
          progress_percentage: progress,
          video_time_watched: Math.floor(ct),
          is_completed: progress >= 90,
        });
      }
      if (progress >= 90 && !isVideoCompleted) {
        setIsVideoCompleted(true);
        await api.updateLessonProgress(lesson.id, { is_completed: true, progress_percentage: 100 });
      }
    }
  }

  function handlePlayPause() {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause(); else videoRef.current.play();
    setIsPlaying(!isPlaying);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    if (!videoRef.current) return;
    const t = parseFloat(e.target.value);
    videoRef.current.currentTime = t;
    setCurrentTime(t);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!videoRef.current) return;
    const v = parseFloat(e.target.value);
    videoRef.current.volume = v;
    setVolume(v);
    setIsMuted(v === 0);
  }

  function handleMuteToggle() {
    if (!videoRef.current) return;
    if (isMuted) { videoRef.current.volume = volume || 0.5; setIsMuted(false); }
    else { videoRef.current.volume = 0; setIsMuted(true); }
  }

  function handlePlaybackRateChange(rate: number) {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  }

  function formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  async function handleSaveNotes() {
    if (!lesson) return;
    setSavingNotes(true);
    try {
      await api.updateLessonNotes(lesson.id, notes);
    } catch { /* ignore */ }
    finally { setSavingNotes(false); }
  }

  function getVideoUrl() { return lesson?.video_filename ? api.getFileUrl(lesson.video_filename, 'video') : null; }
  function getPdfUrl() { return lesson?.pdf_filename ? api.getFileUrl(lesson.pdf_filename, 'pdf') : null; }

  function getLessonProgress(lId: number) {
    return courseProgress?.lessons?.find((l: any) => l.id === lId)?.progress;
  }

  // Navigate to next/prev lesson
  const currentIdx = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  if (loading || loadingLesson || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="animate-spin rounded-full h-12 w-12" style={{ borderColor: '#c9a96e', borderTopColor: 'transparent', borderWidth: '3px' }}></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Leccion no encontrada.</p>
      </div>
    );
  }

  const videoUrl = getVideoUrl();
  const pdfUrl = getPdfUrl();
  const completedCount = courseProgress?.completedLessons || 0;
  const totalCount = courseProgress?.totalLessons || allLessons.length;
  const overallProg = courseProgress?.overallProgress || 0;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#111111' }}>
      {/* Sidebar - hack4u style */}
      <div
        className="shrink-0 flex flex-col h-screen sticky top-0 overflow-hidden transition-all"
        style={{
          width: sidebarOpen ? 340 : 0,
          background: '#1a1a1a',
          borderRight: sidebarOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full overflow-hidden" style={{ width: 340 }}>
            {/* Course header */}
            <div className="p-4 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => router.push(`/courses/${courseId}`)}
                className="text-xs mb-3 flex items-center gap-1"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                ← Volver
              </button>
              <h2 className="text-sm font-semibold mb-2" style={{ color: '#ffffff', fontFamily: "'Source Serif 4', Georgia, serif" }}>
                {course?.title || 'Curso'}
              </h2>
              <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {Math.round(overallProg)}% completado ({completedCount}/{totalCount})
              </p>
              <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-1.5 rounded-full no-transition" style={{ background: '#c9a96e', width: `${overallProg}%` }} />
              </div>
            </div>

            {/* Lesson list */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {allLessons.map((l, idx) => {
                const prog = getLessonProgress(l.id);
                const isActive = l.id === lessonId;
                const isCompleted = prog?.is_completed;
                const hasProgress = (prog?.progress_percentage || 0) > 0;

                return (
                  <button
                    key={l.id}
                    onClick={() => router.push(`/courses/${courseId}/lessons/${l.id}`)}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 transition-all"
                    style={{
                      background: isActive ? 'rgba(201,169,110,0.12)' : 'transparent',
                      borderLeft: isActive ? '3px solid #c9a96e' : '3px solid transparent',
                    }}
                  >
                    {/* Status icon */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                      style={
                        isCompleted
                          ? { background: 'var(--success)', color: '#fff' }
                          : isActive
                            ? { background: '#c9a96e', color: '#1a1a1a' }
                            : hasProgress
                              ? { background: 'rgba(14,165,233,0.2)', color: 'var(--accent)' }
                              : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }
                      }
                    >
                      {isCompleted ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      ) : (
                        idx + 1
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm truncate"
                        style={{ color: isActive ? '#ffffff' : isCompleted ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.7)' }}
                      >
                        {l.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="shrink-0 flex items-center justify-between px-4 h-12" style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <h1 className="text-sm font-medium truncate" style={{ color: '#ffffff' }}>
              {lesson.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isVideoCompleted && (
              <span className="tag tag-success text-xs">Completada</span>
            )}
            {/* Nav arrows */}
            <button
              onClick={() => prevLesson && router.push(`/courses/${courseId}/lessons/${prevLesson.id}`)}
              disabled={!prevLesson}
              className="p-1.5 rounded disabled:opacity-20"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button
              onClick={() => nextLesson && router.push(`/courses/${courseId}/lessons/${nextLesson.id}`)}
              disabled={!nextLesson}
              className="p-1.5 rounded disabled:opacity-20"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>

        {/* Video area */}
        <div className="shrink-0">
          {videoUrl ? (
            <div className="relative w-full bg-black" style={{ paddingBottom: '50%', maxHeight: '70vh' }}>
              <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full"
                style={{ objectFit: 'contain' }}
                onTimeUpdate={handleVideoTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadStart={() => { setIsVideoLoading(true); setVideoError(null); }}
                onCanPlay={() => { setIsVideoLoading(false); if (videoRef.current) setDuration(videoRef.current.duration); }}
                onError={() => { setIsVideoLoading(false); setVideoError('Error al cargar el video.'); }}
                onLoadedMetadata={() => { if (videoRef.current && lesson?.progress?.video_time_watched) videoRef.current.currentTime = lesson.progress.video_time_watched; }}
                preload="metadata"
                playsInline
                src={videoUrl}
              />

              {isVideoLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10" style={{ borderColor: '#c9a96e', borderTopColor: 'transparent', borderWidth: '3px' }}></div>
                </div>
              )}

              {videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/75">
                  <div className="text-center">
                    <p className="text-sm mb-3" style={{ color: '#ef4444' }}>{videoError}</p>
                    <button onClick={() => { setVideoError(null); setIsVideoLoading(true); videoRef.current?.load(); }}
                      className="px-4 py-2 text-sm rounded-lg btn-primary">Reintentar</button>
                  </div>
                </div>
              )}

              {/* Controls */}
              {!isVideoLoading && !videoError && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10">
                  <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek}
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer slider mb-2"
                    style={{ background: `linear-gradient(to right, #c9a96e 0%, #c9a96e ${(currentTime/(duration||1))*100}%, rgba(255,255,255,0.2) ${(currentTime/(duration||1))*100}%, rgba(255,255,255,0.2) 100%)` }}
                  />
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <button onClick={handlePlayPause} className="p-1">
                        {isPlaying ? (
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                        ) : (
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
                        )}
                      </button>
                      <button onClick={handleMuteToggle} className="p-1">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.617-3.793a1 1 0 011.383-.131z" clipRule="evenodd"/>
                        </svg>
                      </button>
                      <input type="range" min="0" max="1" step="0.1" value={isMuted ? 0 : volume} onChange={handleVolumeChange}
                        className="w-16 h-1 rounded-lg appearance-none cursor-pointer" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}/>
                      <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handlePlaybackRateChange(playbackRate === 0.75 ? 1 : playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : playbackRate === 1.5 ? 2 : 0.75)}
                        className="px-2 py-0.5 text-xs rounded" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                        {playbackRate}x
                      </button>
                      <button onClick={() => { if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen(); }} className="p-1">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center" style={{ background: '#111111' }}>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Esta leccion no tiene video</p>
            </div>
          )}
        </div>

        {/* Below video: tabs for content & notes */}
        <div className="flex-1 overflow-y-auto" style={{ background: '#1a1a1a' }}>
          {/* Tab bar */}
          <div className="flex px-6 pt-4 gap-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {(['contenido', 'notas'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2.5 text-sm font-medium capitalize"
                style={{
                  color: activeTab === tab ? '#ffffff' : 'rgba(255,255,255,0.4)',
                  borderBottom: activeTab === tab ? '2px solid #c9a96e' : '2px solid transparent',
                }}
              >
                {tab === 'contenido' ? 'Contenido' : 'Mis Notas'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'contenido' && (
              <div className="space-y-6">
                {/* Lesson text content */}
                {lesson.content && (
                  <div>
                    <h3 className="text-lg mb-4" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: '#ffffff' }}>
                      {lesson.title}
                    </h3>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm p-5 rounded-xl leading-relaxed"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                        {lesson.content}
                      </pre>
                    </div>
                  </div>
                )}

                {/* PDF material */}
                {pdfUrl && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Material PDF</h3>
                    <iframe src={pdfUrl} className="w-full h-96 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }} title="PDF"/>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm" style={{ color: '#c9a96e' }}>
                      Abrir en nueva pestana →
                    </a>
                  </div>
                )}

                {!lesson.content && !pdfUrl && (
                  <p className="text-sm text-center py-8" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Esta leccion solo tiene contenido en video.
                  </p>
                )}

                {/* Next lesson CTA */}
                {nextLesson && (
                  <div className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <button
                      onClick={() => router.push(`/courses/${courseId}/lessons/${nextLesson.id}`)}
                      className="w-full flex items-center justify-between p-4 rounded-xl transition-all"
                      style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}
                    >
                      <div className="text-left">
                        <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Siguiente leccion</p>
                        <p className="text-sm font-medium" style={{ color: '#ffffff' }}>{nextLesson.title}</p>
                      </div>
                      <span style={{ color: '#c9a96e' }}>→</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notas' && (
              <div>
                <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Tus notas personales para esta leccion. Se guardan automaticamente.
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.8)',
                    resize: 'vertical',
                  }}
                  placeholder="Escribe tus notas aqui..."
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="mt-4 px-6 py-2.5 text-sm font-medium rounded-lg disabled:opacity-50"
                  style={{ background: '#c9a96e', color: '#1a1a1a' }}
                >
                  {savingNotes ? 'Guardando...' : 'Guardar notas'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
