// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCardBlocks } from '../redux/slices/cardsSlice';
import CardBlock from '../components/CardBlock';
import CardSearchForm from '../components/CardSearchForm';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar'; // ✅ nuevo import

export default function Dashboard() {
  const dispatch = useDispatch();
  const { blocks, loading, error } = useSelector((state) => state.cards);

  useEffect(() => {
    dispatch(fetchCardBlocks());
  }, [dispatch]);

  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar /> {/* ✅ navegación lateral */}
        <main style={{ flex: 1, padding: '2rem' }}>
          <h2>Validación de registros</h2>
          <CardSearchForm />
          {loading && <p>Cargando bloques...</p>}
          {typeof error === 'string' && error && (
            <p style={{ color: 'red' }}>{error}</p>
          )}
          {Array.isArray(blocks) && blocks.length > 0 ? (
            blocks.map((block) => (
              <CardBlock key={block.id} block={block} />
            ))
          ) : (
            !loading && !error && <p>No hay bloques disponibles.</p>
          )}
        </main>
      </div>
    </>
  );
}