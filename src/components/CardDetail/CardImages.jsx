import { useState } from 'react';

export default function CardImages({ images, apiUrl, onDelete, canEdit }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) {
    return <p>No hay imágenes aún.</p>;
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {images.map((img) => {
          const imageUrl = `${apiUrl}${img.url}`;
          return (
            <div key={img.id} style={{ position: 'relative' }}>
              <img
                src={imageUrl}
                alt="card"
                style={{ width: '200px', borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => setSelectedImage(imageUrl)}
                onError={(e) => {
                  if (!e.target.src.includes('placeholder.jpg')) {
                    console.error("❌ Error al cargar imagen:", e.target.src);
                    e.target.src = '/placeholder.jpg';
                  }
                }}
              />
              {canEdit && (
                <button
                  onClick={() => onDelete(img.id)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'rgba(255,0,0,0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer'
                  }}
                  title="Eliminar imagen"
                >
                  🗑️
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'zoom-out'
          }}
        >
          <img
            src={selectedImage}
            alt="Ampliada"
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px' }}
          />
        </div>
      )}
    </>
  );
}