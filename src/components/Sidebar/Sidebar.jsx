import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Sidebar.module.css';

export default function Sidebar({ isVisible }) {
  const { user } = useSelector((state) => state.auth);
  const sidebarClass = isVisible ? styles.sidebarVisible : styles.sidebarHidden;

  return (
    <aside className={`${styles.sidebar} ${sidebarClass}`}>
      <h4 className={styles.title}>📂 Menú</h4>
      <ul className={styles.menu}>
        <li><Link to="/dashboard" className={styles.link}>📊 Dashboard</Link></li>

        {(user?.role === 'editor' || user?.role === 'admin') && (
          <li><Link to="/users" className={styles.link}>👥 Usuarios</Link></li>
        )}

        {user?.role === 'admin' && (
          <li><Link to="/admin" className={styles.link}>🛠️ Admin</Link></li>
        )}
      </ul>
    </aside>
  );
}