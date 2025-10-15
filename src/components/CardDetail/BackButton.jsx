export default function BackButton({ onClick }) {
  return (
    <button onClick={onClick} style={{ marginTop: '2rem' }}>
      ⬅ Volver al listado
    </button>
  );
}