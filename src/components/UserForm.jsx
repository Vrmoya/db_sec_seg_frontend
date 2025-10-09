// src/components/UserForm.jsx
import { useState, useEffect } from 'react';

export const UserForm = ({ initialData = {}, onSubmit, roles = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '', // nunca mostrar el actual
        role: initialData.role || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nombre:</label>
      <input name="name" value={formData.name} onChange={handleChange} required />

      <label>Email:</label>
      <input name="email" type="email" value={formData.email} onChange={handleChange} required />

      <label>Contraseña:</label>
      <input name="password" type="password" value={formData.password} onChange={handleChange} required={!initialData.id} />

      <label>Rol:</label>
      <select name="role" value={formData.role} onChange={handleChange} required>
        <option value="">Seleccionar rol</option>
        {roles.map(r => (
          <option key={r.id} value={r.name}>{r.name}</option>
        ))}
      </select>

      <button type="submit">Guardar</button>
    </form>
  );
};