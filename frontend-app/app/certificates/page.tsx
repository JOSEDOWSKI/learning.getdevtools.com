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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Certificados</h1>
          <p className="mt-2 text-gray-600">
            Gestiona y verifica tus certificados obtenidos
          </p>
        </div>

        {loadingCertificates ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando certificados...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No has obtenido certificados aún.</p>
            <button
              onClick={() => router.push('/courses')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Explorar Cursos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {certificate.is_national_title ? (
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">🏆</span>
                        <h3 className="text-xl font-bold text-gray-900">
                          Título Nacional
                        </h3>
                      </div>
                    ) : (
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">📜</span>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Certificado de Curso
                        </h3>
                      </div>
                    )}
                    {certificate.career && (
                      <p className="text-lg text-gray-700 font-medium">
                        {certificate.career.name}
                      </p>
                    )}
                    {certificate.course && (
                      <p className="text-gray-600">{certificate.course.title}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="text-sm">
                    <span className="text-gray-500">Emitido:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {new Date(certificate.issue_date).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-500">Hash de Verificación:</span>
                    <div className="mt-1 font-mono text-xs bg-gray-50 p-2 rounded break-all">
                      {certificate.hash_digital_signature}
                    </div>
                  </div>

                  <a
                    href={getVerificationUrl(certificate.hash_digital_signature)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    🔗 Verificar Certificado
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

