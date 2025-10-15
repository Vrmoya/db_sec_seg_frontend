export default function CardInfo({ card }) {
  return (
    <>
      <p><strong>Dominio:</strong> {card.dominio}</p>
      <p><strong>Marca:</strong> {card.marca}</p>
      <p><strong>Modelo:</strong> {card.modelo}</p>
      <p><strong>Color:</strong> {card.color}</p>
      <p><strong>Lugar:</strong> {card.lugar}</p>
      <p><strong>Fecha:</strong> {new Date(card.fecha).toLocaleDateString('es-AR')}</p>
      <p><strong>Síntesis:</strong> {card.sintesis}</p>
    </>
  );
}