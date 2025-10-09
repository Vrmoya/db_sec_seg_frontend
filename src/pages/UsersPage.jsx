// src/pages/UsersPage.jsx
import { useState, useEffect } from 'react';
import { useUsers } from '../hooks/useUsers';
import { UserTable } from '../components/UserTable';
import { UserForm } from '../components/UserForm';
import {
  createUser,
  updateUser,
  deleteUser,
  getRoles
} from '../services/userService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const UsersPage = () => {
  const {
    users,
    loading,
    currentPage,
    totalPages,
    fetchUsers
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getRoles()
      .then(setRoles)
      .catch(() => {
        toast.error('Error al cargar roles');
      });
  }, []);

  const handleSubmit = async (formData) => {
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
        toast.success('Usuario actualizado correctamente');
      } else {
        await createUser(formData);
        toast.success('Usuario creado correctamente');
      }

      setSelectedUser(null);
      fetchUsers(1, searchTerm); // recarga desde la primera página con filtro
    } catch (error) {
      toast.error('Error al guardar el usuario');
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (!confirm) return;

    try {
      await deleteUser(id);
      toast.success('Usuario eliminado');
      fetchUsers(currentPage, searchTerm); // recarga manteniendo filtro y página
    } catch (error) {
      toast.error('Error al eliminar el usuario');
      console.error(error);
    }
  };

  const handleSearch = () => {
    fetchUsers(1, searchTerm); // buscar desde la primera página
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div>
      <ToastContainer />
      <h2>Gestión de Usuarios</h2>

      {/* Buscador */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por nombre o email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {/* Formulario */}
      <UserForm
        initialData={selectedUser}
        onSubmit={handleSubmit}
        roles={roles}
      />

      {selectedUser && (
        <button onClick={() => setSelectedUser(null)}>
          Cancelar edición
        </button>
      )}

      {/* Tabla con paginación */}
      <UserTable
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => fetchUsers(page, searchTerm)}
      />
    </div>
  );
};