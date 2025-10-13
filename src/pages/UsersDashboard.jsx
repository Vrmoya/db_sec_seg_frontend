import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, toggleUser } from '../redux/slices/usersSlice';
import { updateUser } from '../services/userService';
import Header from '../components/Header';

export default function UsersDashboard() {
  const dispatch = useDispatch();
  const { list, loading, error, total } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchUsers({ page, limit }));
  }, [dispatch, page]);

  const handleToggle = (id) => {
    if (window.confirm("¿Estás seguro de modificar este usuario?")) {
      dispatch(toggleUser(id));
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUser(id, { role: newRole });
      dispatch(fetchUsers({ page, limit }));
    } catch (err) {
      console.error("Error al actualizar rol:", err);
    }
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
        <h2>Gestión de usuarios ({total})</h2>

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
            <option value="viewer">Usuario</option>
          </select>
        </div>

        {loading && <p>Cargando usuarios...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

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
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Usuario</option>
                  </select>
                </td>
                <td style={{ color: user.active ? 'green' : 'gray' }}>
                  <input
                    type="checkbox"
                    checked={user.active}
                    onChange={() => handleToggle(user.id)}
                  />
                </td>
                <td>
                  <button onClick={() => handleToggle(user.id)}>
                    {user.active ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '1rem' }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
          <span style={{ margin: '0 1rem' }}>Página {page}</span>
          <button onClick={() => setPage(page + 1)}>Siguiente</button>
        </div>
      </div>
    </>
  );
}