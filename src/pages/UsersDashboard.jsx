// src/pages/UsersDashboard.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, toggleUser } from '../redux/slices/usersSlice';
import Header from '../components/Header';

export default function UsersDashboard() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleToggle = (id) => {
    dispatch(toggleUser(id));
  };

  const filteredUsers = list.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter ? user.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });

  return (
    <>
      <Header />
      <div style={{ padding: '2rem' }}>
        <h2>Gestión de usuarios</h2>

        {/* 🔍 Filtros */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Buscar por nombre o email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: '1rem', padding: '0.5rem' }}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '0.5rem' }}
          >
            <option value="">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="user">Usuario</option>
          </select>
        </div>

        {/* 🔄 Estado */}
        {loading && <p>Cargando usuarios...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* 📋 Tabla */}
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Activo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.active ? 'Sí' : 'No'}</td>
                <td>
                  <button onClick={() => handleToggle(user.id)}>
                    {user.active ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}