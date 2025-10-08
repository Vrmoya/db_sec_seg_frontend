// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCardBlocks } from '../redux/slices/cardsSlice';
import CardBlock from '../components/CardBlock';
import CardSearchForm from '../components/CardSearchForm';




export default function Dashboard() {
  const dispatch = useDispatch();
  const { blocks, loading } = useSelector((state) => state.cards);

  useEffect(() => {
    dispatch(fetchCardBlocks());
  }, [dispatch]);

  return (
    <div>
      <h2>Validación de registros</h2>
      <CardSearchForm />
      {loading && <p>Cargando bloques...</p>}
      {blocks.map((block) => (
        <CardBlock key={block.id} block={block} />
      ))}
    </div>
  );
}