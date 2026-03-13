'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Gold top bar */}
      <div className="nav-gold-bar" />

      {/* Navigation */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid var(--warm-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span
              className="text-lg tracking-tight"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, color: 'var(--text-primary)' }}
            >
              DEVTOOLS
            </span>
            <div className="flex items-center space-x-6">
              <Link href="/courses" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Cursos
              </Link>
              <Link href="/careers" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Carreras
              </Link>
              <Link
                href="/login"
                className="text-sm"
                style={{ color: 'var(--text-primary)', fontWeight: 500 }}
              >
                Iniciar Sesion
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          DevTools Learning / Cursos
        </p>
        <h1
          className="text-5xl md:text-6xl mb-6 leading-tight"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 400, color: 'var(--text-primary)' }}
        >
          Aprende desarrollo
          <br />
          de software
        </h1>
        <p className="text-lg mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Plataforma educativa con cursos, carreras de 24 meses, certificaciones
          verificables y evaluacion con inteligencia artificial.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/register?role=alumno"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded"
            style={{ background: 'var(--btn-primary)', color: '#ffffff' }}
          >
            Crear cuenta alumno
          </Link>
          <Link
            href="/register?role=profesor"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded"
            style={{ border: '1px solid var(--warm-border)', color: 'var(--text-primary)', background: '#ffffff' }}
          >
            Quiero ser profesor
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Cursos con video',
              description: 'Clases en video con seguimiento de progreso, notas personales y material PDF complementario.',
            },
            {
              title: 'Evaluacion IA',
              description: 'Entrega tu proyecto y recibe evaluacion automatica con inteligencia artificial en minutos.',
            },
            {
              title: 'Certificaciones',
              description: 'Obtiene certificados verificables con firma digital al completar cursos y carreras completas.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="card-warm p-6"
            >
              <h3
                className="text-lg mb-3"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, color: 'var(--text-primary)' }}
              >
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
