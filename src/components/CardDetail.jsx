import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import baseApi from '../services/baseApi';

export default function CardDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const canEdit = ['editor', 'admin'].includes(user?.role);

  const filters = location.state?.filters || {};
  const page = location.state?.page || 1;

  const [card, setCard] = useState(null);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      const res = await baseApi.get(`/cards/${id}`);
      setCard(res.data);
      setImages(res.data.cardImages || []);
      setForm({
        marca: res.data.marca || '',
        modelo: res.data.modelo || '',
        color: res.data.color || '',
        lugar: res.data.lugar || '',
        sintesis: res.data.sintesis || '',
      });

      const res2 = await baseApi.get(`/cards/dominio/${res.data.dominio}`);
      const otros = res2.data.filter((c) => c.id !== parseInt(id));
      setHistorial(otros);
    };

    fetchCard();
  }, [id]);

  const handleUpload = async () => {
    if (files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/png'];
    const isValid = files.every((file) => validTypes.includes(file.type));
    if (!isValid) {
      alert('Solo se permiten imágenes JPG y PNG');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    setUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);

    try {
      await baseApi.post(`/cards/${id}/images`, formData, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percent);
        },
      });

      const res = await baseApi.get(`/cards/${id}`);
      setCard(res.data);
      setImages(res.data.cardImages || []);
      setFiles([]);
      setUploadComplete(true);
      setTimeout(() => setUploadComplete(false), 3000);
    } catch (err) {
      console.error('Error al subir imágenes:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.marca || !form.modelo || !form.color || !form.lugar || !form.sintesis) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      await baseApi.put(`/cards/${id}`, form);
      const res = await baseApi.get(`/cards/${id}`);
      setCard(res.data);
      setForm({
        marca: res.data.marca,
        modelo: res.data.modelo,
        color: res.data.color,
        lugar: res.data.lugar,
        sintesis: res.data.sintesis,
      });
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error al guardar cambios:', err);
    }
  };

  const handleVolver = () => {
    navigate('/dashboard', {
      state: {
        filters,
        page,
      },
    });
  };

  if (!card) return <p>Cargando...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Detalle del bloque #{card.id}</h2>

      {canEdit && (
        <button onClick={() => setEditing(true)} style={{ marginBottom: '1rem' }}>
          ✏️ Editar bloque
        </button>
      )}

      {success && <p style={{ color: 'green' }}>✅ Cambios guardados correctamente</p>}

      {!editing ? (
        <>
          <p><strong>Dominio:</strong> {card.dominio}</p>
          <p><strong>Marca:</strong> {card.marca}</p>
          <p><strong>Modelo:</strong> {card.modelo}</p>
          <p><strong>Color:</strong> {card.color}</p>
          <p><strong>Lugar:</strong> {card.lugar}</p>
          <p><strong>Fecha:</strong> {new Date(card.fecha).toLocaleDateString('es-AR')}</p>
          <p><strong>Síntesis:</strong> {card.sintesis}</p>
        </>
      ) : (
        <div style={{ marginBottom: '2rem' }}>
          <label>Marca:<br />
            <input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} />
          </label><br />
          <label>Modelo:<br />
            <input value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} />
          </label><br />
          <label>Color:<br />
            <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </label><br />
          <label>Lugar:<br />
            <input value={form.lugar} onChange={(e) => setForm({ ...form, lugar: e.target.value })} />
          </label><br />
          <label>Síntesis:<br />
            <textarea value={form.sintesis} onChange={(e) => setForm({ ...form, sintesis: e.target.value })} />
          </label><br />
          <button onClick={handleSave}>Guardar cambios</button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: '1rem' }}>Cancelar</button>
        </div>
      )}

      <h3>Imágenes asociadas</h3>
      {images.length === 0 ? (
        <p>No hay imágenes aún.</p>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {images.map((img) => (
            <img
              key={img.id}
              src={`${import.meta.env.VITE_API_URL}${img.url}`}
              alt="card"
              style={{ width: '200px', borderRadius: '8px' }}
            />
          ))}
        </div>
      )}

      <h3 style={{ marginTop: '2rem' }}>Subir nuevas imágenes</h3>
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png"
        onChange={(e) => setFiles([...e.target.files])}
      />
      <button onClick={handleUpload} disabled={uploading || files.length === 0}>
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

      <h3 style={{ marginTop: '3rem' }}>Historial del dominio: {card.dominio}</h3>
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

      <button onClick={handleVolver} style={{ marginTop: '2rem' }}>
        ⬅ Volver al listado
      </button>
    </div>
  );
}