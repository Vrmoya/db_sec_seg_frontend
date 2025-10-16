import styles from './ImageUpload.module.css';

export default function ImageUpload({
  files,
  setFiles,
  uploading,
  uploadProgress,
  uploadComplete,
  onUpload
}) {
  return (
    <>
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png"
        onChange={(e) => setFiles([...e.target.files])}
        className={styles.fileInput}
      />

      <button
        onClick={onUpload}
        disabled={uploading || files.length === 0}
        className={styles.buttonPrimary}
      >
        {uploading ? 'Subiendo...' : '📤 Subir imágenes'}
      </button>

      {uploading && (
        <div className={styles.progressContainer}>
          <progress
            value={uploadProgress}
            max="100"
            className={styles.progressBar}
          />
          <p className={styles.progressText}>{uploadProgress}%</p>
        </div>
      )}

      {uploadComplete && (
        <p className={styles.successMessage}>
          ✅ Imágenes cargadas correctamente
        </p>
      )}
    </>
  );
}