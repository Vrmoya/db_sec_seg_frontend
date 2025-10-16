import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, toggleUser } from '../../redux/slices/usersSlice';
import { updateUser } from '../../services/userService';
import Header from '../../components/Header/Header';
import styles from './UsersDashboard.module.css';

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
      <div className={styles.container}>
        <h2 className={styles.title}>Gestión de usuarios ({total})</h2>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar por nombre o email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.input}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={styles.select}
          >
            <option value="">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Usuario</option>
          </select>
        </div>

        {loading && <p>Cargando usuarios...</p>}
        {error && <p className={styles.error}>{error}</p>}

        <table className={styles.table}>
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
                    className={styles.select}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Usuario</option>
                  </select>
                </td>
                <td className={user.active ? styles.active : styles.inactive}>
                  <input
                    type="checkbox"
                    checked={user.active}
                    onChange={() => handleToggle(user.id)}
                  />
                </td>
                <td>
                  <button onClick={() => handleToggle(user.id)} className={styles.button}>
                    {user.active ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className={styles.button}>
            Anterior
          </button>
          <span>Página {page}</span>
          <button onClick={() => setPage(page + 1)} className={styles.button}>
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
}