'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

interface Career {
  id: number;
  name: string;
  description: string;
  total_months: number;
  status: string;
  curriculum?: Array<{
    id: number;
    course_id: number;
    order_index: number;
    course: {
      id: number;
      title: string;
    };
  }>;
}

export default function AdminCareersPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    total_months: 24,
    status: 'draft',
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!loading && isAuthenticated && user?.role !== 'super_admin') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, loading, router, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'super_admin') {
      loadCareers();
    }
  }, [isAuthenticated, user]);

  async function loadCareers() {
    try {
      setLoadingCareers(true);
      const response = await api.getCareers();
      if (response.data) {
        setCareers(response.data);
      }
    } catch (error) {
      console.error('Error loading careers:', error);
    } finally {
      setLoadingCareers(false);
    }
  }

  async function handleCreate() {
    try {
      const response = await api.createCareer(formData);
      if (response.data) {
        await loadCareers();
        setShowCreateModal(false);
        setFormData({
          name: '',
          description: '',
          total_months: 24,
          status: 'draft',
        });
      } else {
        alert('Error al crear carrera');
      }
    } catch (error) {
      console.error('Error creating career:', error);
      alert('Error al crear carrera');
    }
  }

  async function handleDelete(careerId: number) {
    if (!confirm('¿Estás seguro de eliminar esta carrera?')) {
      return;
    }

    try {
      const response = await api.deleteCareer(careerId);
      if (response.data || !response.error) {
        await loadCareers();
      } else {
        alert('Error al eliminar carrera');
      }
    } catch (error) {
      console.error('Error deleting career:', error);
      alert('Error al eliminar carrera');
    }
  }

  function getStatusColor(status: string) {
    return status === 'active'
      ? 'bg-[var(--success-bg)] text-[var(--success)]'
      : 'bg-[var(--cream)] text-[var(--text-primary)]';
  }

  function getStatusLabel(status: string) {
    return status === 'active' ? 'Activa' : 'Borrador';
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--text-secondary)]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'super_admin') {
    return null;
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] font-serif">Gestión de Carreras</h1>
            <p className="mt-2 text-[var(--text-secondary)]">
              Crea y gestiona planes de carrera (mínimo 24 cursos)
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[var(--btn-primary)] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            + Crear Carrera
          </button>
        </div>

        {loadingCareers ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--text-secondary)]">Cargando carreras...</p>
          </div>
        ) : careers.length === 0 ? (
          <div className="bg-[var(--cream-light)] rounded-lg border border-[var(--warm-border)] p-8 text-center">
            <p className="text-[var(--text-secondary)] mb-4">No hay carreras creadas aún.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[var(--btn-primary)] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Crear primera carrera
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {careers.map((career) => (
              <div
                key={career.id}
                className="bg-[var(--cream-light)] rounded-lg border border-[var(--warm-border)] hover:border-[var(--accent)] transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-2xl font-semibold text-[var(--text-primary)] mr-3 font-serif">
                        {career.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-[var(--warm-border)] ${getStatusColor(
                          career.status
                        )}`}
                      >
                        {getStatusLabel(career.status)}
                      </span>
                    </div>
                    <p className="text-[var(--text-secondary)] mb-2">{career.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-[var(--text-muted)]">
                      <span>{career.total_months} meses</span>
                      <span>{career.curriculum?.length || 0} cursos</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/careers/${career.id}`}
                      className="bg-[var(--btn-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Gestionar Plan
                    </Link>
                    <button
                      onClick={() => handleDelete(career.id)}
                      className="bg-[var(--error)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de creación */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border border-[var(--warm-border)] w-96 shadow-lg rounded-md bg-[var(--cream-light)]">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 font-serif">
                  Crear Nueva Carrera
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Nombre de la Carrera
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-[var(--warm-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--cream)]"
                      placeholder="Ej: Desarrollo Full Stack"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-[var(--warm-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--cream)]"
                      placeholder="Descripción de la carrera..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Duración (meses)
                      </label>
                      <input
                        type="number"
                        value={formData.total_months}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_months: parseInt(e.target.value) || 24,
                          })
                        }
                        className="w-full px-4 py-2 border border-[var(--warm-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--cream)]"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Estado
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-[var(--warm-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--cream)]"
                      >
                        <option value="draft">Borrador</option>
                        <option value="active">Activa</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleCreate}
                    className="flex-1 bg-[var(--btn-primary)] text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Crear
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({
                        name: '',
                        description: '',
                        total_months: 24,
                        status: 'draft',
                      });
                    }}
                    className="flex-1 bg-[var(--warm-border)] text-[var(--text-primary)] py-2 rounded-lg font-medium hover:opacity-70 transition-opacity"
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

