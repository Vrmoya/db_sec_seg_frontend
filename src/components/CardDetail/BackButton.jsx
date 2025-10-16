export default function BackButton({ onClick, className }) {
  return (
    <button onClick={onClick} className={className}>
      🔙 Volver al listado
    </button>
  );
}