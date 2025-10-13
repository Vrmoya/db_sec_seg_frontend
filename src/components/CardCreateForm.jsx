import { useState } from 'react';
import baseApi from '../services/baseApi';

export default function CardCreateForm() {
  const [form, setForm] = useState({
    type: '',
    marca: '',
    modelo: '',
    dominio: '',
    color: '',
    lugar: '',
    fecha: '',
    sintesis: '',
  });

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      files.forEach((file) => formData.append('images', file));

      // Crear el card
      const res = await baseApi.post('/cards', formData);
      const newCardId = res.data.id;

      // Subir imágenes si hay
      if (files.length > 0) {
        await baseApi.post(`/cards/${newCardId}/images`, formData);
      }

      setSuccess(true);
      setForm({
        type: '',
        marca: '',
        modelo: '',
        dominio: '',
        color: '',
        lugar: '',
        fecha: '',
        sintesis: '',
      });
      setFiles([]);
    } catch (err) {
      console.error('Error al crear card:', err);
      setError('Hubo un error al crear el registro.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2>Crear nuevo card</h2>

      {['type', 'marca', 'modelo', 'dominio', 'color', 'lugar', 'sintesis'].map((field) => (
        <div key={field} style={{ marginBottom: '1rem' }}>
          <label>{field.toUpperCase()}</label>
          <input
            name={field}
            value={form[field]}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
      ))}

      <div style={{ marginBottom: '1rem' }}>
        <label>FECHA</label>
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>IMÁGENES</label>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png"
          onChange={(e) => setFiles([...e.target.files])}
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creando...' : 'Crear card'}
      </button>

      {success && <p style={{ color: 'green' }}>✅ Card creado correctamente</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}