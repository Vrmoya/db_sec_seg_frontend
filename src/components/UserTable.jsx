// src/components/UserTable.jsx
export const UserTable = ({
  users,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange
}) => (
  <div>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <button onClick={() => onEdit(user)}>Editar</button>
              <button onClick={() => onDelete(user.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Paginación */}
    <div style={{ marginTop: '1rem' }}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </button>

      <span style={{ margin: '0 1rem' }}>
        Página {currentPage} de {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente
      </button>
    </div>
  </div>
);