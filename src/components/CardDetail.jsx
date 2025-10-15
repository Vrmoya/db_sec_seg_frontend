import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import baseApi from '../services/baseApi';

import CardInfo from './CardDetail/CardInfo';
import CardForm from './CardDetail/CardForm';
import CardImages from './CardDetail/CardImages';
import ImageUpload from './CardDetail/ImageUpload';
import CardHistory from './CardDetail/CardHistory';
import BackButton from './CardDetail/BackButton';

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
      try {
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
      } catch (err) {
        console.error('Error al cargar detalle de tarjeta:', err);
      }
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

  const handleDeleteImage = async (imageId) => {
  const confirm = window.confirm('¿Estás seguro de que querés eliminar esta imagen?');
  if (!confirm) return;

  console.log('🗑️ Eliminando imagen:', imageId);

  try {
    await baseApi.delete(`/cards/${id}/images/${imageId}`);
    const res = await baseApi.get(`/cards/${id}`);
    console.log('🔄 Nuevas imágenes desde backend:', res.data.cardImages);
    setImages(res.data.cardImages || []);
  } catch (err) {
    console.error('❌ Error al eliminar imagen:', err);
    alert('No se pudo eliminar la imagen.');
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
      state: { filters, page },
    });
  };
  const handleDeleteCard = async () => {
  const confirm = window.confirm('¿Estás seguro de que querés eliminar este bloque? Esta acción no se puede deshacer.');
  if (!confirm) return;

  try {
    await baseApi.delete(`/cards/${id}`);
    alert('✅ Card eliminada correctamente');
    navigate('/dashboard');
  } catch (err) {
    console.error('❌ Error al eliminar la card:', err);
    alert('No se pudo eliminar la card.');
  }
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
        <CardInfo card={card} />
      ) : (
        <CardForm
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}

      <h3>Imágenes asociadas</h3>
      <CardImages
        images={images}
        apiUrl={import.meta.env.VITE_API_URL}
        onDelete={handleDeleteImage}
        canEdit={canEdit}
      />

      <ImageUpload
        files={files}
        setFiles={setFiles}
        uploading={uploading}
        uploadProgress={uploadProgress}
        uploadComplete={uploadComplete}
        onUpload={handleUpload}
      />

      <CardHistory historial={historial} dominio={card.dominio} />

      <BackButton onClick={handleVolver} />
      {user?.role === 'admin' && (
  <button
    onClick={handleDeleteCard}
    style={{
      backgroundColor: '#e40eaeff',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      marginTop: '2rem',
    }}
  >
    🗑️ Eliminar Registro
  </button>
)}
    </div>
  );
}