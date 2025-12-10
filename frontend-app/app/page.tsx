'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="flex items-center justify-between mb-12">
          <div className="text-2xl font-bold">Learning Platform</div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold shadow hover:bg-gray-100"
            >
              Iniciar sesión
            </Link>
          </div>
        </header>

        <main className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Aprende y enseña como en Platzi
            </h1>
            <p className="text-lg text-blue-50 mb-8">
              Crea tu cuenta como alumno para acceder a cursos, o regístrate como profesor
              para publicar contenido y gestionar tus lecciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register?role=alumno"
                className="px-6 py-3 rounded-lg bg-white text-blue-700 font-semibold shadow hover:bg-gray-100 text-center"
              >
                Crear cuenta alumno
              </Link>
              <Link
                href="/register?role=profesor"
                className="px-6 py-3 rounded-lg bg-yellow-300 text-blue-900 font-semibold shadow hover:bg-yellow-200 text-center"
              >
                Quiero ser profesor
              </Link>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/20">
            <h2 className="text-2xl font-semibold mb-4">Beneficios</h2>
            <ul className="space-y-3 text-blue-50">
              <li>✅ Subida de video y PDF por lección</li>
              <li>✅ Seguimiento de progreso y notas</li>
              <li>✅ Acceso controlado a cursos</li>
              <li>✅ Panel para profesores</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
