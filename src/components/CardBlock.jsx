import { useDispatch, useSelector } from 'react-redux';
import { validateBlock } from '../redux/slices/cardsSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CardBlock({ block }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validated = useSelector((state) => state.cards.validated);
  const [validating, setValidating] = useState(false);

  const handleValidate = async (e) => {
    e.stopPropagation();
    setValidating(true);
    try {
      await dispatch(validateBlock(block.id)).unwrap();
    } catch (err) {
      console.error("Error al validar:", err);
    } finally {
      setValidating(false);
    }
  };

  const handleNavigate = () => {
    navigate(`/cards/${block.id}`, {
      state: {
        filters: block._filters,
        page: block._page,
      },
    });
  };

  const isValidated = validated.includes(block.id);
  const fechaFormateada = block.fecha
    ? new Date(block.fecha).toLocaleDateString('es-AR')
    : 'Sin fecha';

  return (
    <div
      onClick={handleNavigate}
      style={{
        border: '1px solid #e00fc5ff',
        marginBottom: '1rem',
        padding: '1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: '#f9f9f9',
        
      }}
    >
      
      <div>
        <strong>{block.marca} {block.modelo}</strong><br />
        Dominio: {block.dominio}<br />
        Tipo: {block.type}<br />
        Fecha: {fechaFormateada}
      </div>
      <button
        onClick={handleValidate}
        disabled={isValidated || validating}
        style={{
          marginTop: '1rem',
          backgroundColor: isValidated ? '#4caf50' : '#2196f3',
          color: 'white',
          cursor: isValidated ? 'default' : 'pointer'
        }}
      >
        {isValidated ? '✅ Validado' : validating ? 'Validando...' : 'Validar bloque'}
      </button>
    </div>
  );
}