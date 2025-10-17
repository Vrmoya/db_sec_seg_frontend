import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';


export default function Header({ onToggleSidebar }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <button className={styles.menuToggle} onClick={onToggleSidebar}>
        ☰
      </button>

      <div className={styles.userInfo}>
        {user?.image && (
          <img
            src={user.image}
            alt="Avatar"
            className={styles.avatar}
          />
        )}
        <div>
          <div className={styles.name}>{user?.name}</div>
          <div className={styles.role}>{user?.role}</div>
        </div>
      </div>

      <button onClick={handleLogout} className={styles.logoutButton}>
        🔓 Cerrar sesión
      </button>
    </header>
  );
}