// src/components/Header.jsx
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

 const handleLogout = () => {
  localStorage.clear(); // ✅ limpia el token y cualquier dato persistente
  dispatch(logout());
  navigate('/login');
};

  return (
    <header style={{ padding: '1rem', background: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    {user?.image && (
      <img
        src={user.image}
        alt="Avatar"
        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
      />
    )}
    <div>
      <strong>{user?.name}</strong>
      <div style={{ fontSize: '0.9rem', color: '#666' }}>{user?.role}</div>
    </div>
  </div>
  <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
    Cerrar sesión
  </button>
</header>

  );
}