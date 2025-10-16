import { useDispatch, useSelector } from 'react-redux';
import { validateBlock } from '../../redux/slices/cardsSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CardBlock.module.css';

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
    <div onClick={handleNavigate} className={styles.card}>
      <div className={styles.details}>
        <h3 className={styles.title}>
          {block.marca} {block.modelo}
        </h3>
        <p><strong>Dominio:</strong> {block.dominio}</p>
        <p><strong>Tipo:</strong> {block.type}</p>
        <p><strong>Fecha:</strong> {fechaFormateada}</p>
      </div>
      <button
        onClick={handleValidate}
        disabled={isValidated || validating}
        className={`${styles.validateButton} ${isValidated ? styles.validated : ''}`}
      >
        {isValidated ? '✅ Validado' : validating ? 'Validando...' : 'Validar bloque'}
      </button>
    </div>
  );
}