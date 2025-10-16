import { useSelector } from 'react-redux';
import styles from '../styles/DashboardPanels.module.css';

export default function AdminDashboard() {
  const { list } = useSelector((state) => state.users);
  const { blocks } = useSelector((state) => state.cards);

  const activos = list?.filter((u) => u.active)?.length || 0;
  const admins = list?.filter((u) => u.role === 'admin')?.length || 0;

  const validados = blocks?.filter((b) => b.status === 'validado')?.length || 0;
  const pendientes = blocks?.filter((b) => b.status === 'pendiente')?.length || 0;
  const totalCards = blocks?.length || 0;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Panel de administración</h2>
      <p className={styles.subtitle}>
        Bienvenido, administrador. Acá vas a poder gestionar usuarios, roles y registros.
      </p>

      <div className={styles.metricsBox}>
        <h3>Métricas rápidas</h3>
        <ul>
          <li>Total de usuarios: {list?.length || 0}</li>
          <li>Usuarios activos: {activos}</li>
          <li>Administradores: {admins}</li>
          <li>Cards totales: {totalCards}</li>
          <li>Cards validados: {validados}</li>
          <li>Cards pendientes: {pendientes}</li>
        </ul>
      </div>
    </div>
  );
}