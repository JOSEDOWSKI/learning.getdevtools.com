'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

interface Certificate {
  id: number;
  hash_digital_signature: string;
  is_national_title: boolean;
  issue_date: string;
  course?: {
    title: string;
  };
  career?: {
    name: string;
  };
}

export default function CertificatesPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loadingCertificates, setLoadingCertificates] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCertificates();
    }
  }, [isAuthenticated]);

  async function loadCertificates() {
    const response = await api.getCertificates();
    if (response.data) {
      setCertificates(response.data);
    }
    setLoadingCertificates(false);
  }

  function getVerificationUrl(hash: string) {
    return `${process.env.NEXT_PUBLIC_API_URL || 'https://learning.getdevtools.com'}/certificates/verify/${hash}`;
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-primary)]"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] font-serif">Mis Certificados</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Gestiona y verifica tus certificados obtenidos
          </p>
        </div>

        {loadingCertificates ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--text-secondary)]">Cargando certificados...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="bg-[var(--cream-light)] rounded-lg border border-[var(--warm-border)] p-8 text-center">
            <p className="text-[var(--text-secondary)] mb-4">No has obtenido certificados aún.</p>
            <button
              onClick={() => router.push('/courses')}
              className="bg-[var(--btn-primary)] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Explorar Cursos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-[var(--cream-light)] rounded-lg border-2 border-[var(--warm-border)] hover:border-[var(--accent)] transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {certificate.is_national_title ? (
                      <div className="mb-2">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] font-serif">
                          Título Nacional
                        </h3>
                      </div>
                    ) : (
                      <div className="mb-2">
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] font-serif">
                          Certificado de Curso
                        </h3>
                      </div>
                    )}
                    {certificate.career && (
                      <p className="text-lg text-[var(--text-primary)] font-medium">
                        {certificate.career.name}
                      </p>
                    )}
                    {certificate.course && (
                      <p className="text-[var(--text-secondary)]">{certificate.course.title}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[var(--warm-border)]">
                  <div className="text-sm">
                    <span className="text-[var(--text-muted)]">Emitido:</span>{' '}
                    <span className="font-medium text-[var(--text-primary)]">
                      {new Date(certificate.issue_date).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-[var(--text-muted)]">Hash de Verificación:</span>
                    <div className="mt-1 font-mono text-xs bg-[var(--cream)] p-2 rounded break-all border border-[var(--warm-border)]">
                      {certificate.hash_digital_signature}
                    </div>
                  </div>

                  <a
                    href={getVerificationUrl(certificate.hash_digital_signature)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-[var(--accent)] hover:text-[var(--accent)]/80 text-sm font-medium"
                  >
                    Verificar Certificado
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

