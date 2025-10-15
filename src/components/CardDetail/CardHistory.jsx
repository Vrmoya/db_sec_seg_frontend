import { Link } from 'react-router-dom';

export default function CardHistory({ historial, dominio }) {
  return (
    <>
      <h3 style={{ marginTop: '3rem' }}>Historial del dominio: {dominio}</h3>
      {historial.length === 0 ? (
        <p>No hay otros registros para este dominio.</p>
      ) : (
        <ul>
          {historial.map((h) => (
            <li key={h.id}>
              <strong>{new Date(h.fecha).toLocaleDateString('es-AR')}</strong> — {h.lugar} — {h.sintesis.slice(0, 60)}...
              <br />
              <Link to={`/cards/${h.id}`}>Ver detalle</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}