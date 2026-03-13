'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

interface User {
  id: number;
  dni: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'alumno',
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
      loadUsers();
    }
  }, [isAuthenticated, user]);

  async function loadUsers() {
    try {
      setLoadingUsers(true);
      const response = await api.getUsers();
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  }

  function handleEdit(user: User) {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    });
    setShowEditModal(true);
  }

  async function handleUpdate() {
    if (!editingUser) return;

    try {
      const response = await api.updateUser(editingUser.id, formData);
      if (response.data) {
        await loadUsers();
        setShowEditModal(false);
        setEditingUser(null);
      } else {
        alert('Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error al actualizar usuario');
    }
  }

  async function handleDelete(userId: number) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) {
      return;
    }

    try {
      const response = await api.deleteUser(userId);
      if (response.data || !response.error) {
        await loadUsers();
      } else {
        alert('Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar usuario');
    }
  }

  function getRoleLabel(role: string) {
    const labels: Record<string, string> = {
      super_admin: 'Administrador',
      profesor: 'Profesor',
      alumno: 'Alumno',
      reclutador: 'Reclutador',
    };
    return labels[role] || role;
  }

  function getRoleColor(role: string) {
    const colors: Record<string, string> = {
      super_admin: 'bg-purple-100 text-purple-800 border-purple-300',
      profesor: 'bg-blue-100 text-blue-800 border-blue-300',
      alumno: 'bg-green-100 text-green-800 border-green-300',
      reclutador: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    };
    return colors[role] || 'bg-[var(--cream)] text-[var(--text-primary)] border-[var(--warm-border)]';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] font-serif">Gestión de Usuarios</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Administra todos los usuarios de la plataforma
          </p>
        </div>

        {loadingUsers ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--text-secondary)]">Cargando usuarios...</p>
          </div>
        ) : (
          <div className="bg-[var(--cream-light)] border border-[var(--warm-border)] overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-[var(--warm-border)]">
              {users.map((user) => (
                <li key={user.id}>
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                          <span className="text-[var(--accent)] font-semibold">
                            {user.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {user.full_name}
                          </p>
                          <span
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(
                              user.role
                            )}`}
                          >
                            {getRoleLabel(user.role)}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          DNI: {user.dni} • Registrado: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-[var(--btn-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-[var(--error)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal de edición */}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border border-[var(--warm-border)] w-96 shadow-lg rounded-md bg-[var(--cream-light)]">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 font-serif">
                  Editar Usuario
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-[var(--warm-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--cream)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-[var(--warm-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--cream)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Rol
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-[var(--warm-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-[var(--cream)]"
                    >
                      <option value="alumno">Alumno</option>
                      <option value="profesor">Profesor</option>
                      <option value="super_admin">Administrador</option>
                      <option value="reclutador">Reclutador</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-[var(--btn-primary)] text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
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

