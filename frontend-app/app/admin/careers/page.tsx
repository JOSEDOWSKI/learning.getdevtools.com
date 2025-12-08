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
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  }

  function getStatusLabel(status: string) {
    return status === 'active' ? 'Activa' : 'Borrador';
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Carreras</h1>
            <p className="mt-2 text-gray-600">
              Crea y gestiona planes de carrera (mínimo 24 cursos)
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            + Crear Carrera
          </button>
        </div>

        {loadingCareers ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando carreras...</p>
          </div>
        ) : careers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No hay carreras creadas aún.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Crear primera carrera
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {careers.map((career) => (
              <div
                key={career.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-2xl font-semibold text-gray-900 mr-3">
                        {career.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          career.status
                        )}`}
                      >
                        {getStatusLabel(career.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{career.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📅 {career.total_months} meses</span>
                      <span>📚 {career.curriculum?.length || 0} cursos</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/careers/${career.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Gestionar Plan
                    </Link>
                    <button
                      onClick={() => handleDelete(career.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
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
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Crear Nueva Carrera
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Carrera
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Desarrollo Full Stack"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descripción de la carrera..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
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

