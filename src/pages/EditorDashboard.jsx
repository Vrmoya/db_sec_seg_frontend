import CardSearchForm from '../components/CardSearchForm/CardSearchForm';
import CardBlock from '../components/CardBlock/CardBlock';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCardBlocks } from '../redux/slices/cardsSlice';
import styles from '../styles/DashboardPanels.module.css';

export default function EditorDashboard() {
  const dispatch = useDispatch();
  const { blocks, loading, error } = useSelector((state) => state.cards);

  useEffect(() => {
    dispatch(fetchCardBlocks({ status: 'pendiente' }));
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Panel del editor</h2>
      <p className={styles.subtitle}>
        Bienvenido, editor. Acá vas a poder validar y revisar registros.
      </p>

      <CardSearchForm />

      {loading && <p>Cargando registros...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {blocks.length > 0 ? (
        blocks.map((block) => (
          <CardBlock key={block.id} block={block} />
        ))
      ) : (
        !loading && <p>No hay registros pendientes.</p>
      )}
    </div>
  );
}