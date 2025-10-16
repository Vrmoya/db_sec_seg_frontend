import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCardBlocks } from '../../redux/slices/cardsSlice';

export default function CardList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blocks, validated, loading, error } = useSelector((state) => state.cards);
  const [dominio, setDominio] = useState('');
  const [estado, setEstado] = useState('todos'); // ✅ nuevo estado

  useEffect(() => {
    const params = {
      limit: 10,
      offset: 0,
      dominio,
    };

    if (estado === 'validados') params.validated = true;
    if (estado === 'noValidados') params.validated = false;

    dispatch(fetchCardBlocks(params));
  }, [dispatch, dominio, estado]);

  const handleClick = (id) => {
    navigate(`/cards/${id}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Listado de bloques</h2>

      <input
        type="text"
        value={dominio}
        onChange={(e) => setDominio(e.target.value)}
        placeholder="Buscar por dominio"
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      />

      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      >
        <option value="todos">Todos</option>
        <option value="validados">Solo validados</option>
        <option value="noValidados">Solo no validados</option>
      </select>

      {loading && <p>Cargando bloques...</p>}
      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}

      {blocks.length === 0 ? (
        <p>No hay registros aún.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {blocks.map((card) => (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: validated.includes(card.id) || card.validated ? '#e0ffe0' : '#f9f9f9',
              }}
            >
              <strong>{card.dominio}</strong> — {card.marca} {card.modelo}
              <br />
              {new Date(card.fecha).toLocaleDateString('es-AR')} — {card.lugar}
              <br />
              <small>{card.sintesis.slice(0, 60)}...</small>
              {(validated.includes(card.id) || card.validated) && (
                <p style={{ color: 'green', marginTop: '0.5rem' }}>✅ Validado</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}