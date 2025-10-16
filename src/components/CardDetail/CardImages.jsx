import { useState } from 'react';
import styles from './CardImages.module.css';

export default function CardImages({ images, apiUrl, onDelete, canEdit }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) {
    return <p>No hay imágenes aún.</p>;
  }

  return (
    <>
      <div className={styles.gallery}>
        {images.map((img) => {
          const imageUrl = `${apiUrl}${img.url}`;
          return (
            <div key={img.id} className={styles.imageWrapper}>
              <img
                src={imageUrl}
                alt="card"
                className={styles.image}
                onClick={() => setSelectedImage(imageUrl)}
                onError={(e) => {
                  if (!e.target.src.includes('placeholder.jpg')) {
                    console.error('❌ Error al cargar imagen:', e.target.src);
                    e.target.src = '/placeholder.jpg';
                  }
                }}
              />
              {canEdit && (
                <button
                  onClick={() => onDelete(img.id)}
                  className={styles.deleteButton}
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
          className={styles.modalOverlay}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Ampliada"
            className={styles.modalImage}
          />
        </div>
      )}
    </>
  );
}