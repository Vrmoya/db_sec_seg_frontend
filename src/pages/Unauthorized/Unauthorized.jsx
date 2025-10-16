import styles from './Unauthorized.module.css';

export default function Unauthorized() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Acceso denegado</h2>
      <p className={styles.message}>No tenés permiso para ver esta página.</p>
    </div>
  );
}