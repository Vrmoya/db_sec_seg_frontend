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
      <h3 style={{ marginTop: '2rem' }}>Subir nuevas imágenes</h3>
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png"
        onChange={(e) => setFiles([...e.target.files])}
      />
      <button onClick={onUpload} disabled={uploading || files.length === 0}>
        {uploading ? 'Subiendo...' : 'Subir imágenes'}
      </button>

      {uploading && (
        <div style={{ marginTop: '1rem' }}>
          <progress value={uploadProgress} max="100" style={{ width: '100%' }} />
          <p>{uploadProgress}%</p>
        </div>
      )}

      {uploadComplete && (
        <p style={{ color: 'green', marginTop: '1rem' }}>✅ Imágenes cargadas correctamente</p>
      )}
    </>
  );
}