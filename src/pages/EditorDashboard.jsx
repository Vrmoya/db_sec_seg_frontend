import CardSearchForm from '../components/CardSearchForm';
import CardBlock from '../components/CardBlock';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCardBlocks } from '../redux/slices/cardsSlice';

export default function EditorDashboard() {
  const dispatch = useDispatch();
  const { blocks, loading, error } = useSelector((state) => state.cards);

  useEffect(() => {
    dispatch(fetchCardBlocks({ status: 'pendiente' }));
  }, [dispatch]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Panel del editor</h2>
      <p>Bienvenido, editor. Acá vas a poder validar y revisar registros.</p>

      <CardSearchForm />

      {loading && <p>Cargando registros...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
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