// src/components/Sidebar.jsx
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside style={{ width: '200px', padding: '1rem', background: '#f4f4f4', height: '100vh' }}>
      <h4>Menú</h4>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link to="/dashboard">Dashboard</Link></li>

        {(user?.role === 'editor' || user?.role === 'admin') && (
          <li><Link to="/users">Usuarios</Link></li>
        )}

        {user?.role === 'admin' && (
          <li><Link to="/admin">Admin</Link></li>
        )}
      </ul>
    </aside>
  );
}