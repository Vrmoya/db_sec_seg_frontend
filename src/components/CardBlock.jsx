// src/components/CardBlock.jsx
import { useDispatch, useSelector } from 'react-redux';
import { validateBlock } from '../redux/slices/cardsSlice';

export default function CardBlock({ block }) {
  const dispatch = useDispatch();
  const validated = useSelector((state) => state.cards.validated);

  const handleValidate = () => {
    dispatch(validateBlock(block.id));
  };

  return (
    <div style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
      <h3>Bloque #{block.id}</h3>
      {block.records.map((record) => (
        <div key={record.id}>
          <strong>{record.vehiculo}</strong> — {record.fecha}
        </div>
      ))}
      <button
        onClick={handleValidate}
        disabled={validated.includes(block.id)}
      >
        {validated.includes(block.id) ? 'Validado' : 'Validar bloque'}
      </button>
    </div>
  );
}