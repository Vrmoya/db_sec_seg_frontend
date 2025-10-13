import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import baseApi from '../services/baseApi';

export default function CardList() {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    baseApi.get('/cards/all').then((res) => {
      setCards(res.data);
    });
  }, []);

  const handleClick = (id) => {
    navigate(`/cards/${id}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Listado de bloques</h2>
      {cards.length === 0 ? (
        <p>No hay registros aún.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9',
              }}
            >
              <strong>{card.dominio}</strong> — {card.marca} {card.modelo}
              <br />
              {new Date(card.fecha).toLocaleDateString('es-AR')} — {card.lugar}
              <br />
              <small>{card.sintesis.slice(0, 60)}...</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}